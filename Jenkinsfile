// MERN ChatApp — CI/CD : vérif build Node, images Docker (backend + frontend), push Docker Hub, rollout Kubernetes
//
// Prérequis sur l’agent Jenkins :
//   - Docker (socket ou DinD selon ta config)
//   - kubectl + kubeconfig pointant vers ton cluster (ou credential fichier kubeconfig)
//
// Credentials Jenkins à créer :
//   - Id "docker-hub" : Username with password (Docker Hub)
//
// Adapte les noms d’images si tes repos Hub ne sont pas chatappbackend / chatappfrontend.

pipeline {
    agent any

    options {
        timestamps()
    }

    parameters {
        string(
            name: 'DOCKERHUB_NAMESPACE',
            defaultValue: 'omartankary',
            description: 'Docker Hub utilisateur ou organisation'
        )
        string(
            name: 'VITE_BACKEND_URL',
            defaultValue: '',
            description: 'Optionnel : URL publique API/socket pour le build Vite (ex. https://api.example.com). Laisser vide pour build par défaut.'
        )
    }

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        K8S_NAMESPACE = 'chat-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Node & client build') {
            steps {
                // Le script npm "test" à la racine échoue volontairement — on valide deps + build Vite
                sh 'npm ci'
                sh 'npm ci --prefix client'
                sh 'npm run build --prefix client'
            }
        }

        stage('Build Docker images') {
            parallel {
                stage('Backend image') {
                    steps {
                        script {
                            def backend = "${params.DOCKERHUB_NAMESPACE}/chatappbackend"
                            def viteUrl = (params.VITE_BACKEND_URL ?: '').trim()
                            def viteArg = viteUrl ? "--build-arg VITE_BACKEND_URL=${viteUrl}" : ''
                            sh """
                                docker build -f server/Dockerfile ${viteArg} \\
                                  -t ${backend}:${IMAGE_TAG} \\
                                  -t ${backend}:latest \\
                                  .
                            """
                        }
                    }
                }
                stage('Frontend image') {
                    steps {
                        script {
                            def frontend = "${params.DOCKERHUB_NAMESPACE}/chatappfrontend"
                            def viteUrl = (params.VITE_BACKEND_URL ?: '').trim()
                            def viteArg = viteUrl ? "--build-arg VITE_BACKEND_URL=${viteUrl}" : ''
                            sh """
                                docker build -f client/Dockerfile ${viteArg} \\
                                  -t ${frontend}:${IMAGE_TAG} \\
                                  -t ${frontend}:latest \\
                                  ./client
                            """
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    script {
                        def b = "${params.DOCKERHUB_NAMESPACE}/chatappbackend"
                        def f = "${params.DOCKERHUB_NAMESPACE}/chatappfrontend"
                        sh """
                            docker push ${b}:${IMAGE_TAG}
                            docker push ${b}:latest
                            docker push ${f}:${IMAGE_TAG}
                            docker push ${f}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { fileExists('k8s/backend-deployment.yaml') }
            }
            steps {
                script {
                    def b = "${params.DOCKERHUB_NAMESPACE}/chatappbackend"
                    def f = "${params.DOCKERHUB_NAMESPACE}/chatappfrontend"
                    // Noms alignés sur k8s/backend-deployment.yaml et k8s/frontend-deployment.yaml
                    sh """
                        kubectl set image deployment/backend-deployment \\
                          chatapp-backend=${b}:${IMAGE_TAG} \\
                          -n ${K8S_NAMESPACE} --record
                        kubectl set image deployment/frontend-deployment \\
                          chatapp-frontend=${f}:${IMAGE_TAG} \\
                          -n ${K8S_NAMESPACE} --record
                        kubectl rollout status deployment/backend-deployment -n ${K8S_NAMESPACE} --timeout=180s
                        kubectl rollout status deployment/frontend-deployment -n ${K8S_NAMESPACE} --timeout=180s
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
