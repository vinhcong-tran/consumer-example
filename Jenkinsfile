pipeline{
  environment {
    registry = "lamnguyen912/evizi-demo-image"
    registryCredential = 'lamnguyen912'
    dockerImage = ''
  }
  agent any
    stages {
        stage('Build'){
           steps{
              script{
                bat 'npm install'
              }
           }
        }
        stage('Building image') {
            steps{
                script {
                  bat 'docker build -t lamnguyen912/evizi-demo-image .'
                 }
             }
          }
       stage('Deploying into k8s'){
        steps{
            bat 'kubectl apply -f deployment.yml'
        }
        }
    }
}
