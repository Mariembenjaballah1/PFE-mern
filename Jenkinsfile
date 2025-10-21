pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    VERSION = "${env.BUILD_NUMBER}"
    DOCKER_FRONT_IMAGE = "mariembenjaballah/mern-frontend:v6"
    DOCKER_BACK_IMAGE = "mariembenjaballah/mern-backend:latest"
    TRIVY_TEMPLATE     = 'html.tpl' 
    ARGOCD_USERNAME = 'admin'
    ARGOCD_PASSWORD = credentials('argocd-admin-password')
    ARGOCD_SERVER = '192.168.56.101:31209'
    APP_NAME = 'inventrack-app'
    KUBECONFIG = '/var/lib/jenkins/kubeconfig'
    BUILD_DATE = "${new Date().format('yyyy-MM-dd HH:mm')}"
    VAULT_ADDR = 'http://192.168.56.101:30820'       // URL du service Vault dans ton cluster
    VAULT_CREDENTIAL_ID = 'SecretVault' 
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    
        

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Install Server Dependencies') {
      steps {
        dir('server') {
          sh 'npm install'
        }
      }
    }

    stage('Run Tests with Coverage') {
      steps {
        dir('server') {
          sh 'npm test -- --coverage'
        }
      }
    }

    stage('Clean Sonar Scanner Work') {
      steps {
        sh 'rm -rf .scannerwork server/.scannerwork'
      }
    }
  
 stage('Snyk Dependency Scan Backend') {
  steps {
    dir('server') {
      withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
        sh '''
          snyk auth $SNYK_TOKEN
          snyk test --file=package.json --json --org=mariembenjaballah1 > snyk-report-backend.json || true
          snyk-to-html -i snyk-report-backend.json -o snyk-report-backend.html
          snyk monitor --file=package.json --org=mariembenjaballah1
        '''
        archiveArtifacts artifacts: 'snyk-report.html', fingerprint: true
      }
    }
  }
}
     stage('Snyk Dependency Scan Frontend') {
  steps {
    
      withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
        sh '''
          snyk auth $SNYK_TOKEN
          snyk test --file=package.json --json --org=mariembenjaballah1 > snyk-report-frontend.json || true
          snyk-to-html -i snyk-report-frontend.json -o snyk-report-frontend.html
          snyk monitor --file=package.json --org=mariembenjaballah1
        '''
        archiveArtifacts artifacts: 'snyk-report-frontend.html', fingerprint: true
      }
    }
  }

    stage('Build Docker Image FRONTEND') {
      steps {
        script {
          sh """
            docker build \
              --build-arg VITE_API_URL=http://192.168.56.101:30904/api \
              -t ${DOCKER_FRONT_IMAGE} \
              .
          """
        }
      }
    }

    stage('Build Docker Image BACKEND') {
      steps {
        dir('server') {
          script {
            sh "docker build -t ${DOCKER_BACK_IMAGE} ."
          }
        }
      }
    }

  
  
    stage('Trivy Scan FRONTEND Image') {
      steps {
        sh '''
          trivy image \
            --light \
            --no-progress \
            --timeout 20m \
            --format template \
            --template @${TRIVY_TEMPLATE} \
            --output trivy_frontend.html \
            ${DOCKER_FRONT_IMAGE}
        '''
        archiveArtifacts artifacts: 'trivy_frontend.html'
      }
    }

    stage('Trivy Scan BACKEND Image') {
      steps {
        sh '''
          trivy image \
            --light \
            --no-progress \
            --timeout 20m \
            --format template \
            --template @${TRIVY_TEMPLATE} \
            --output trivy_backend.html \
            ${DOCKER_BACK_IMAGE}
        '''
        archiveArtifacts artifacts: 'trivy_backend.html'
      }
    }

   
   

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube Local') {
          dir('server') {
            sh 'ls -la coverage'
            sh "${tool 'SonarScanner'}/bin/sonar-scanner -Dsonar.login=${SONAR_TOKEN} -Dsonar.projectVersion=${env.BUILD_NUMBER}"
          }
        }
      }
    }

    stage('Push Docker Image BACKEND') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'Dockercredentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin'
          sh "docker push ${DOCKER_BACK_IMAGE}"
        }
      }
    }

    stage('Push Docker Image FRONTEND') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'Dockercredentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin'
          sh "docker push ${DOCKER_FRONT_IMAGE}"
        }
      }
    }
stage('Snyk IaC Scan') {
  steps {
    withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
      sh '''
        snyk auth $SNYK_TOKEN
        snyk iac test k8s/k8s-deployment.yaml --severity-threshold=high --json | snyk-to-html -o snyk-iac-report.html || true
      '''
      archiveArtifacts artifacts: 'snyk-iac-report.html', fingerprint: true
    }
  }
}
    stage('Login Argo CD') {
            steps {
                sh """
                argocd login ${env.ARGOCD_SERVER} --username ${env.ARGOCD_USERNAME} --password ${env.ARGOCD_PASSWORD} --insecure
                """
            }
        }
  stage('Sync Vault via ArgoCD') {
    steps {
       
            sh """
            
                argocd app sync vault
                argocd app wait vault --health --timeout 300
            """
        }
    }
stage('Fetch Secrets from Vault') {
  steps {
    withVault([
      configuration: [
        vaultUrl: 'http://192.168.56.101:30820',
        vaultCredentialId: 'SecretVault',
        engineVersion: 2
      ],
      vaultSecrets: [[
        path: 'secret/backend',
        secretValues: [
          [envVar: 'JWT_SECRET', vaultKey: 'JWT_SECRET'],
          [envVar: 'JWT_REFRESH_SECRET', vaultKey: 'JWT_REFRESH_SECRET']
        ]
      ]]
    ]) {
      sh '''
        echo "✅ Secrets récupérés depuis Vault"
        echo "JWT_SECRET=$JWT_SECRET"
        echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
      '''
    }
  }
}



        stage('Sync Application') {
            steps {
                sh "argocd app sync ${env.APP_NAME}"
            }
        }

        stage('Wait for Healthy') {
            steps {
                sh "argocd app wait ${env.APP_NAME} --health --timeout 300"
            }
        }

        stage('Check Pods Status') {
            steps {
                script {
                    def namespace = 'inventrack'
                    def podsStatus = sh (
                        script: "kubectl get pods -n ${namespace} --no-headers",
                        returnStdout: true
                    ).trim()

                    echo "Pods status:\n${podsStatus}"

                    def notRunning = podsStatus.readLines().findAll { !it.contains("Running") }

                    if (notRunning.size() > 0) {
                        error "Certains pods ne sont pas en état Running:\n${notRunning.join('\n')}"
                    } else {
                        echo "Tous les pods sont en Running ✅"
                    }
                }
            }
        }

    
    stage('Quality Gate') {
      steps {
        timeout(time: 15, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
  
  post {
    success {
      notifySlack("✅ *Build Succeeded* 🎉\n• *Job:* `${env.JOB_NAME}`\n• *Build:* #${env.BUILD_NUMBER}\n• *Date:* ${env.BUILD_DATE}\n• *Lien:* <${env.BUILD_URL}|Voir sur Jenkins>")
    }

    failure {
      notifySlack("❌ *Build Failed* 🔥\n• *Job:* `${env.JOB_NAME}`\n• *Build:* #${env.BUILD_NUMBER}\n• *Date:* ${env.BUILD_DATE}\n• *Lien:* <${env.BUILD_URL}|Voir sur Jenkins>")
    }
  }
}

def notifySlack(String message) {
  withCredentials([string(credentialsId: 'SLACK_URL', variable: 'SLACK_URL')]) {
    sh """
      curl -X POST -H 'Content-type: application/json' --data '{
        "text": "${message}"
      }' "$SLACK_URL"
    """
  }
}

