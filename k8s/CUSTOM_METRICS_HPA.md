# Custom Metrics HPA Configuration

# For Advanced Auto-scaling Beyond CPU/Memory

This guide shows how to configure custom metrics-based HPA for workloads that need specialized scaling triggers.

## 📊 When to Use Custom Metrics

**Use CPU/Memory HPA** (Standard - Already Configured ✅):

- Web applications
- API services
- Stateless applications
- General-purpose workloads
- **ChloroMaster uses this** ✅

**Consider Custom Metrics When**:

- Queue-based processing (scale on queue depth)
- Message brokers (scale on lag/messages)
- Database connections (scale on active connections)
- Response times (scale on latency)
- Business metrics (scale on concurrent users, orders/sec)

## 🛠️ Prerequisites for Custom Metrics

1. **Metrics Server** (Required - For standard CPU/Memory)

   ```bash
   kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
   ```

2. **Prometheus** (For custom metrics)

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
   ```

3. **Prometheus Adapter** (Exposes custom metrics to K8s)

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install prometheus-adapter prometheus-community/prometheus-adapter -n monitoring
   ```

## 📝 Example: Backend API with Request Rate Scaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa-custom
  namespace: chloromaster
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 20  # Can scale higher with custom metrics
  
  metrics:
  # 1. Standard CPU (Primary)
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  
  # 2. Standard Memory (Secondary)
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  
  # 3. Custom: HTTP Requests per Second (Per Pod)
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "500"  # Scale when pod handles >500 RPS
  
  # 4. Custom: API Response Time
  - type: Pods
    pods:
      metric:
        name: http_request_duration_seconds_p95
      target:
        type: AverageValue
        averageValue: "1"  # Scale when p95 latency >1s
  
  # 5. Custom: Active Database Connections
  - type: Pods
    pods:
      metric:
        name: db_active_connections
      target:
        type: AverageValue
        averageValue: "50"  # Scale when >50 DB connections per pod
  
  # 6. Object-based: Service-level metric
  - type: Object
    object:
      metric:
        name: ingress_requests_per_second
      describedObject:
        apiVersion: v1
        kind: Service
        name: backend-service
      target:
        type: Value
        value: "10000"  # Scale when service receives >10k RPS
  
  # 7. External: Cloud provider metrics
  - type: External
    external:
      metric:
        name: aws_elb_request_count
        selector:
          matchLabels:
            environment: production
      target:
        type: AverageValue
        averageValue: "5000"
  
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 600  # 10 min for custom metrics
      policies:
      - type: Percent
        value: 25  # More conservative with custom metrics
        periodSeconds: 120
      selectPolicy: Min
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
      - type: Percent
        value: 50  # Scale faster but not as aggressive
        periodSeconds: 30
      selectPolicy: Max
```

## 📊 Prometheus Adapter Configuration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-adapter
  namespace: monitoring
data:
  config.yaml: |
    rules:
    # HTTP Requests per Second
    - seriesQuery: 'http_requests_total{namespace="chloromaster",pod=~"backend-.*"}'
      resources:
        template: <<.Resource>>
      name:
        matches: "^(.*)_total"
        as: "${1}_per_second"
      metricsQuery: |
        sum(rate(<<.Series>>{<<.LabelMatchers>>}[2m])) by (<<.GroupBy>>)
    
    # HTTP Request Duration (p95)
    - seriesQuery: 'http_request_duration_seconds{namespace="chloromaster",pod=~"backend-.*"}'
      resources:
        template: <<.Resource>>
      name:
        matches: "^(.*)$"
        as: "${1}_p95"
      metricsQuery: |
        histogram_quantile(0.95, 
          sum(rate(<<.Series>>_bucket{<<.LabelMatchers>>}[2m])) by (le, <<.GroupBy>>)
        )
    
    # Database Connections
    - seriesQuery: 'db_connections_active{namespace="chloromaster",pod=~"backend-.*"}'
      resources:
        template: <<.Resource>>
      name:
        matches: "^(.*)$"
        as: "${1}"
      metricsQuery: |
        avg(<<.Series>>{<<.LabelMatchers>>}) by (<<.GroupBy>>)
```

## 🎯 Application Instrumentation

Your application needs to expose metrics for Prometheus to scrape:

### .NET Backend (using prometheus-net)

```csharp
// Add to Program.cs
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddMetrics();

var app = builder.Build();

// Expose metrics endpoint
app.UseMetricServer();  // /metrics endpoint
app.UseHttpMetrics();   // Automatic HTTP metrics

app.Run();
```

### Custom Metrics in Controllers

```csharp
using Prometheus;

public class ContactController : ControllerBase
{
    private static readonly Counter RequestsTotal = Metrics
        .CreateCounter("http_requests_total", "Total HTTP requests",
            new CounterConfiguration { LabelNames = new[] { "method", "endpoint" } });
    
    private static readonly Histogram RequestDuration = Metrics
        .CreateHistogram("http_request_duration_seconds", "HTTP request duration",
            new HistogramConfiguration { LabelNames = new[] { "method", "endpoint" } });
    
    private static readonly Gauge ActiveConnections = Metrics
        .CreateGauge("db_connections_active", "Active database connections");
    
    [HttpPost]
    public async Task<IActionResult> Submit()
    {
        using (RequestDuration.WithLabels("POST", "/api/contact").NewTimer())
        {
            RequestsTotal.WithLabels("POST", "/api/contact").Inc();
            
            // Your logic here
            
            return Ok();
        }
    }
}
```

## 🔍 Testing Custom Metrics HPA

```bash
# 1. Check if metrics are available
kubectl get apiservice | grep metrics

# 2. Test custom metrics API
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1" | jq .

# 3. Check specific metric
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/chloromaster/pods/*/http_requests_per_second" | jq .

# 4. Describe HPA (shows current metric values)
kubectl describe hpa backend-hpa-custom -n chloromaster

# 5. Generate load
hey -z 5m -c 100 -q 50 http://chloromaster.com/api/services

# 6. Watch scaling
watch 'kubectl get hpa -n chloromaster && echo && kubectl get pods -n chloromaster'
```

## ⚡ Best Practices for Custom Metrics

1. **Start with CPU/Memory** ✅ (ChloroMaster already does this)
   - Simplest and most reliable
   - Works for 80% of use cases
   - No additional infrastructure needed

2. **Add Custom Metrics When**:
   - CPU/Memory doesn't reflect load accurately
   - Business-specific scaling triggers needed
   - Complex workload patterns (queues, batch processing)

3. **Metric Selection**:
   - Choose metrics that directly correlate with load
   - Use rate metrics (per second) for traffic-based scaling
   - Use gauge metrics for capacity-based scaling
   - Combine multiple metrics (CPU + RPS + latency)

4. **Threshold Tuning**:
   - Start conservative, adjust based on observations
   - Monitor for 1-2 weeks before production
   - Document why you chose specific thresholds

5. **Stabilization Windows**:
   - Longer for custom metrics (5-10 min)
   - Prevent flapping on noisy metrics
   - Use proper aggregation (avg, p95, max)

6. **Testing**:
   - Load test before enabling in production
   - Verify metrics are scraped correctly
   - Test scale-up and scale-down scenarios
   - Ensure metrics survive pod restarts

## 📚 Common Custom Metric Patterns

### Queue Depth

```yaml
- type: External
  external:
    metric:
      name: queue_depth
    target:
      type: AverageValue
      averageValue: "100"  # Scale when queue >100 messages per pod
```

### Active Users

```yaml
- type: Pods
  pods:
    metric:
      name: active_users
    target:
      type: AverageValue
      averageValue: "1000"  # Scale when >1000 active users per pod
```

### Message Processing Lag

```yaml
- type: Pods
  pods:
    metric:
      name: kafka_consumer_lag
    target:
      type: AverageValue
      averageValue: "1000"  # Scale when lag >1000 messages
```

---

## ✅ Recommendation for ChloroMaster

**Current Configuration** (CPU + Memory HPA): **✅ Perfect for your use case**

Your application is a typical web application (React frontend + .NET backend) serving HTTP requests. The standard CPU/Memory-based HPA is:

- ✅ Simple and reliable
- ✅ No additional infrastructure needed
- ✅ Handles traffic patterns well
- ✅ Proven at scale

**Consider Custom Metrics If**:

- You add background job processing
- Queue-based workflows are implemented
- Very specific SLA requirements (p99 latency)
- Business metrics become critical (orders/sec, conversions)

**Current Setup is Production-Ready** ✅
