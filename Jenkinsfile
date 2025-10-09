pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    VERSION = "${env.BUILD_NUMBER}"
    DOCKER_FRONT_IMAGE = "mariembenjaballah/mern-frontend:v1"
    DOCKER_BACK_IMAGE = "mariembenjaballah/mern-backend:latest"
    TRIVY_TEMPLATE     = 'html.tpl' 
    NVD_API_KEY = credentials('NVD_API_KEY')
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
  
 stage('OWASP Dependency Check') {
  steps {
    echo "Starting OWASP Dependency Check scan..."
    dependencyCheck additionalArguments: "--nvdApiKey=${NVD_API_KEY} --project \"my-project\" --scan ./ --format HTML --out .",
                    odcInstallation: 'DependencyCheck'
    echo "OWASP Dependency Check scan completed."
    archiveArtifacts artifacts: 'dependency-check-report.html', fingerprint: true
    dependencyCheckPublisher pattern: 'dependency-check-report.html'
  }
}
    stage('Build Docker Image FRONTEND') {
      steps {
        script {
          sh """
            docker build \
              --build-arg VITE_API_URL=http://backend.inventrack.svc.cluster.local:5000/api \
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

    stage('Publish Trivy Reports') {
      steps {
        publishHTML([
          reportDir: '.',
          reportFiles: 'trivy_frontend.html',
          reportName: 'Trivy Frontend Scan Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: false
        ])
        publishHTML([
          reportDir: '.',
          reportFiles: 'trivy_backend.html',
          reportName: 'Trivy Backend Scan Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: false
        ])
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
        snyk iac test k8s-deployment.yaml --severity-threshold=high --json | snyk-to-html -o snyk-iac-report.html || true
        snyk iac monitor --file=k8s-deployment.yaml
      '''
      archiveArtifacts artifacts: 'snyk-iac-report.html', fingerprint: true
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
}
