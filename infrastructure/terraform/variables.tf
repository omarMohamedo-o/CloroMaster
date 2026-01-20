variable "region" {
  description = "AWS region"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "root_volume_size" {
  description = "Root EBS volume size (GB)"
  type        = number
}

variable "key_name" {
  description = "Existing AWS key pair name"
  type        = string
}

variable "admin_cidr" {
  description = "CIDR block allowed to SSH"
  type        = string
}

variable "repo_url" {
  description = "Git repository URL"
  type        = string
}

variable "repo_branch" {
  description = "Git branch"
  type        = string
}

variable "app_dir" {
  description = "Application directory"
  type        = string
}

variable "ssh_user" {
  description = "SSH user"
  type        = string
}

variable "ssh_public_key" {
  description = "Optional SSH public key to append to the default user's authorized_keys (public key string)"
  type        = string
  default     = ""
}

# Docker image names (optional: CI can push images and set these)
variable "docker_image_backend" {
  description = "Backend image (registry)"
  type        = string
  default     = "chloromaster/backend:latest"
}

variable "docker_image_frontend" {
  description = "Frontend image (registry)"
  type        = string
  default     = "chloromaster/frontend:latest"
}

variable "docker_image_nginx" {
  description = "Nginx image (registry)"
  type        = string
  default     = "0marmohamed/chloromaster-nginx:prod"
}

variable "docker_image_redis" {
  description = "Redis image (registry)"
  type        = string
  default     = "chloromaster/redis:latest"
}

# SSM parameter names for SMTP credentials (store actual secrets in SSM)
variable "smtp_username_ssm" {
  description = "SSM parameter name for smtp username, e.g. /chloromaster/prod/smtp_username"
  type        = string
}

variable "smtp_password_ssm" {
  description = "SSM parameter name for smtp password, e.g. /chloromaster/prod/smtp_password"
  type        = string
}

# ---------------- SMTP ----------------
variable "smtp_host" {
  type = string
}

variable "smtp_port" {
  type = number
}

variable "smtp_username" {
  type = string
}

variable "smtp_password" {
  type      = string
  sensitive = true
}

variable "smtp_from_email" {
  type = string
}

# ---------------- App Flags ----------------
variable "allow_datasheet_without_email" {
  type = bool
}
