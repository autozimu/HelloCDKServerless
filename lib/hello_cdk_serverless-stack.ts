import * as cdk from '@aws-cdk/cdk';
import { WidgetService } from './widget_service';

export class HelloCdkServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new WidgetService(this, 'Widgets');
  }
}
