# **Software Containerization**

### XM0091 Vrije Universiteit Amsterdam

I will introduce a Task board app which can be used to publish tasks on the web page. First I gonna introduce the application architecture with the deployment diagram. 

The frontend application is built using React.js and serves as the user interface . It is deployed within a Kubernetes cluster and runs on an Nginx web server. 

The REST API is developed using Node.js and Express.js. It handles all CRUD operations for task data. 

MongoDB is used as the database for storing data.  To ensure data persistence, MongoDB is configured with a Persistent Volume Claim (PVC) that provides reliable storage. 

## Pods

```bash
kubectl get pods
```

## Services

```bash
kubectl get services
```

## Storage

Mongodb

```bash
kubectl get pv
kubectl get pvc
```

## Configmap & Secret

```bash
kubectl get configmap
kubectl get secret
```

## Role Based Access Control

- **Low Permission Role**: Suitable for services that only need basic read access. This role allows reading and listing Pods and Services but does not permit any write operations.
- **Medium Permission Role**: Suitable for services that require both read and write access. This role allows creating, reading, updating, and deleting Pods and Services but cannot manage higher-level resources such as Deployments.
- **High Permission Role**: Suitable for services that need full control. This role allows managing Deployments, Pods, Services, and PersistentVolumeClaims, among other resources.

## Test for Medium Permission Role

Ensure that the medium permission role can create, read, update, and delete Pods and Services but cannot manage Deployments.

```bash
echo "Testing medium permission role..."

kubectl create serviceaccount medium-permission-sa

kubectl auth can-i create pods --as=system:serviceaccount:default:medium-permission-sa
kubectl auth can-i delete services --as=system:serviceaccount:default:medium-permission-sa
kubectl auth can-i create deployments --as=system:serviceaccount:default:medium-permission-sa

```

## Network Policy

1. **Allow Frontend Application to Access REST API Service**:
   - The `frontend-to-api-networkpolicy.yaml` file configures a network policy that allows Pods with the `app: frontend` label to access Pods with the `app: tasks-api` label on port 3000.
2. **Allow REST API Service to Access MongoDB**:
   - The `api-to-mongo-networkpolicy.yaml` file configures a network policy that allows Pods with the `app: tasks-api` label to access Pods with the `app: mongo` label on port 27017.
3. **Allow External Traffic to Access Frontend Application**:
   - The `allow-external-to-frontend-networkpolicy.yaml` file configures a network policy that allows traffic from any IP to access Pods with the `app: frontend` label on port 80. 

```bash
kubectl get networkpolicies
```

```bash
echo "Testing API to MongoDB connection from an unauthorized Pod..."

kubectl run unauthorized-api-test --rm -i --tty --image=busybox -- /bin/sh -c "
echo 'Trying to connect to mongo:27017...'
if nc -zv mongo 27017; then
  echo 'Connection to mongo:27017 succeeded.'
else
  echo 'Connection to mongo:27017 failed.'
fi
"

```

## Certificates

### Certificate Configuration in the Project

I use certificates to ensure secure communication. 

1. **Self-Signed Certificates**
   - I use self-signed certificates to provide TLS/SSL support for our services. This means we generate our own certificates for encryption rather than obtaining them from a public Certificate Authority (CA).
2. **Certificate Manager (cert-manager)**
   - I use cert-manager to automatically manage certificates . 
   - cert-manager can automatically create, renew, and update certificates,.
3. **Certificate Generation**
   - Using OpenSSL to generate self-signed certificates. Here are the steps to generate a self-signed certificate:
4. **Nginx Ingress Configuration**

```bash
kubectl get secrets

kubectl get all -n cert-manager

kubectl get clusterissuer
```

## Image Build and Push

I use Docker to build and push images. Here are the detailed steps:

1. **Write Dockerfile**:

   - Write Dockerfile for each component (Frontend, REST API, MongoDB).
   - For example, the Dockerfile for the Frontend might look like this:

2. **Build Docker Images**:

   - Use the `docker build` command to build images for each component.

     ```bash
     docker build -t zengqhh/frontend:latest .
     ```

3. **Push Docker Images to Docker Hub**:

   - Use the `docker push` command to push images to Docker Hub.

     ```bash
     docker push zengqhh/frontend:latest .
     ```

## Managing Chart

```bash
helm install myapp ./myapp
helm list
helm uninstall myapp
helm upgrade myapp ./myapp --set image.tag=latest
```

## Horizontal Pod Autoscaler

```bash
kubectl get hpa tasks-api-hpa
kubectl get deployment tasks-api -w
kubectl exec -it load-generator -- /bin/sh
# while true; do wget -q -O- http://tasks-api:3000/tasks; done
```

## Docker images artifacts

The Dockerfile is a script that contains a series of instructions to assemble a Docker image. 

Docker Compose is a tool for defining and running multi-container Docker applications. 

## Kubernetes Artifacts

These artifacts include various YAML files that define the resources and configurations needed to deploy and manage our application within a Kubernetes cluster. These Kubernetes artifacts (Deployments, Services, Ingress, Persistent Volumes, Persistent Volume Claims, and Network Policies)ensure our application is  scalable and easy to modify.

## Application Upgrade and Re-deployment

```bash
kubectl apply -f frontend-deployment.yaml
kubectl rollout status deployment/frontend
```



