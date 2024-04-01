# Ticketing App

This repository contains a ticketing application that enables users to purchase tickets online and make payments. The application is built using React.js for the frontend, Node.js for the backend, and it follows a microservices architecture. MongoDB is used as the primary database for storage and JetStream (Pub/Sub system) as a communicator between microservices.

## Setup

Before running the application, ensure that you have set up the necessary configurations and dependencies.

### Secrets Configuration

To run the application, you need to create the following secrets using `kubectl`:

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=your_stripe_secret_key
```

Replace `your_jwt_secret` and `your_stripe_secret_key` with your preferred secret keys.

### Ingress Controller

To set up the Ingress controller for Kubernetes, apply the following configuration:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

This will deploy the Ingress controller, allowing external access to your application.

## Running the Application

After setting up the secrets and the Ingress controller, you can run the Ticketing App by following these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/your_username/ticketing-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ticketing-app
   ```

3. Install dependencies for each service:

   ```bash
   cd auth && npm install && cd ..
   cd tickets && npm install && cd ..
   cd orders && npm install && cd ..
   cd client && npm install && cd ..
   cd expirations && npm install && cd ..
   ```

4. Run each service:

   ```bash
   # Run Auth service
   cd auth && npm start

   # Run Tickets service
   cd tickets && npm start

   # Run Orders service
   cd orders && npm start

   # Run Expiration service
   cd expirations && npm start

   # Run Client (Frontend) service
   cd client && npm start
   ```

5. Access the application in your browser at `http://localhost:3000`.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues. Your contributions are highly appreciated!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
