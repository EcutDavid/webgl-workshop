node {
   stage('Preparation') {
        git 'https://github.com/EcutDavid/react-resetcss-dev-template.git'
        sh 'yarn install'
   }
   stage('tests') {
        try {
            sh 'npm test'
            stage('build') {
                sh 'npm run dist'
            }
            stage('deploy') {
                sh 'npm run deploy'
            }
        } catch (e) {
            throw e
        }
   }
}
