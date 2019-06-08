import * as cdk from "@aws-cdk/cdk";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";

export class WidgetService extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, "WidgetStore");

        const handler = new lambda.Function(this, "WidgetHandler", {
            runtime: lambda.Runtime.NodeJS810, // So we can use async in widget.js
            code: lambda.Code.directory("resources"),
            handler: "widgets.main",
            environment: {
                BUCKET: bucket.bucketName
            }
        });

        bucket.grantReadWrite(handler); // was: handler.role);

        const api = new apigateway.RestApi(this, "widgets-api", {
            restApiName: "Widget Service",
            description: "This service serves widgets."
        });

        const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod("GET", getWidgetsIntegration); // GET /

        const widget = api.root.addResource('{name}');

        // Add new widget to bucket with: POST /{name}
        const postWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Get a specific widget from bucket with: GET /{name}
        const getWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Remove a specific widget from the bucket with: DELETE /{name}
        const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler);

        widget.addMethod('POST', postWidgetIntegration);    // POST /{name}
        widget.addMethod('GET', getWidgetIntegration);       // GET /{name}
        widget.addMethod('DELETE', deleteWidgetIntegration); // DELETE /{name}
    }
}
