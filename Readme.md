kubectl create secret generic jwt-secret --from-literal=JWT_KEY=secret
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=secret-key-from-stripe-dashboard-account

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
