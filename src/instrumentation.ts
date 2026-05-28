import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

const endpoint = process.env.SIGNOZ_ENDPOINT || undefined;

let _sdk: NodeSDK | undefined;

if (endpoint) {
  const appName = process.env.APPLICATION_NAME ?? "bun-hono-service";
  const env = process.env.ENVIRONMENT ?? "production";

  _sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: `${appName}-${env}`,
      [ATTR_SERVICE_VERSION]: process.env.APP_VERSION ?? "dev",
      "deployment.environment.name": env,
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${endpoint}/v1/traces`,
    }),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${endpoint}/v1/metrics`,
        }),
        exportIntervalMillis: 30_000,
      }),
    ],
    logRecordProcessors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({ url: `${endpoint}/v1/logs` })),
    ],
  });

  _sdk.start();
}

export function shutdownOtel(): Promise<void> {
  return _sdk?.shutdown() ?? Promise.resolve();
}
