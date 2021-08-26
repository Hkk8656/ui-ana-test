pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm i isexe'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            script{
             allure([
                includeProperties: false, jdk: '', results: [[path: 'cypress/reports']]
             ])
             }
            }
        }
        stage('Deploy') {
            steps {
                println "Deploy"
            }
        }
    }
}