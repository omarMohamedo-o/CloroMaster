terraform {
  required_version = ">= 1.2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

# ----------------------------------
# Ubuntu 22.04 AMI
# ----------------------------------
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# ----------------------------------
# Security Group
# ----------------------------------
resource "aws_security_group" "app_sg" {
  name        = "chloromaster-sg"
  description = "Allow SSH, HTTP, HTTPS"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "chloromaster-sg"
  }
}

# New security group for cross-region rebuilds (avoids stale SG id issues)
resource "aws_security_group" "app_sg_new" {
  name        = "chloromaster-sg-us"
  description = "Allow SSH, HTTP, HTTPS (created in target region)"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "chloromaster-sg-us"
  }
}

# ----------------------------------
# IAM Role for SSM
# ----------------------------------
resource "aws_iam_role" "ssm_role" {
  name = "chloromaster-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ssm_profile" {
  name = "chloromaster-ssm-profile"
  role = aws_iam_role.ssm_role.name
}

# Allow the instance role to read SSM parameters under the app path
resource "aws_iam_role_policy" "ssm_get_parameters_inline" {
  name = "chloromaster-ssm-get-parameters-inline"
  role = aws_iam_role.ssm_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ],
        Resource = "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/chloromaster/*"
      }
    ]
  })
}

# ----------------------------------
# EC2 Instance
# ----------------------------------
resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = tostring(var.key_name) != "" ? var.key_name : null
  # Use the new SG resource to avoid referencing a security group id from another region
  vpc_security_group_ids = [aws_security_group.app_sg_new.id]
  iam_instance_profile   = aws_iam_instance_profile.ssm_profile.name

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/cloud_init.tpl", {
    repo_url                      = var.repo_url
    repo_branch                   = var.repo_branch
    app_dir                       = var.app_dir
    ssh_user                      = var.ssh_user
    smtp_host                     = var.smtp_host
    smtp_port                     = var.smtp_port
    smtp_from_email               = var.smtp_from_email
    allow_datasheet_without_email = var.allow_datasheet_without_email
    smtp_username_ssm             = var.smtp_username_ssm
    smtp_password_ssm             = var.smtp_password_ssm
    docker_image_backend          = var.docker_image_backend
    docker_image_frontend         = var.docker_image_frontend
    docker_image_nginx            = var.docker_image_nginx
    docker_image_redis            = var.docker_image_redis
    aws_region                    = var.region
    ssh_public_key                = var.ssh_public_key
  })

  # When user_data changes we want Terraform to replace the instance so the
  # new SSH key (and other boot-time changes) are applied. Setting this to
  # true makes that explicit.
  user_data_replace_on_change = true

  tags = {
    Name = "chloromaster-app"
  }
}
