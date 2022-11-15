import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnDomain, CfnRepository } from 'aws-cdk-lib/aws-codeartifact';
import { Construct } from 'constructs';

export class CodeArtifactStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const artifactDomain = new CfnDomain(this, 'artifact-domain', {
      domainName: 'npm-artifacts'
    });

    const npmRepository = new CfnRepository(this, "npm-artifact-repo", {
      domainName: artifactDomain.domainName,
      repositoryName: "npmjs",
      externalConnections: ["public:npmjs"],
    });
    npmRepository.addDependsOn(artifactDomain);

    new CfnOutput(this, 'artifact-repo-url', { value: npmRepository.ref })
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new CodeArtifactStack(app, 'cdk-codeartifact-npm-dev', { env: devEnv });
// new MyStack(app, 'cdk-codeartifact-npm-prod', { env: prodEnv });

app.synth();