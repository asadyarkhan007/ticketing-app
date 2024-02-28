kubectl create secret generic jwt-secret --from-literal=JWT_KEY=secret

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
