/**
 * Kinesis to ES handler
 *
 * @packageDocumentation
 */

import {
  KinesisStreamHandler,
  KinesisStreamEvent,
  KinesisStreamRecordPayload
} from 'aws-lambda';
import 'source-map-support/register';
const AWS = require('aws-sdk');
import { esDomain } from '../constants/esDomain';

/** AWS Lambda entrypoint */
export const handler: KinesisStreamHandler = (
  event: KinesisStreamEvent
): void => {
  event.Records.forEach((record) => {
    let kinesisRecord: KinesisStreamRecordPayload = record.kinesis;
    let recordData = Buffer.from(kinesisRecord.data, 'base64');
    postToES(recordData);
  });
};

/*
 * Post the given document to Elasticsearch
 */
function postToES(doc) {
  const endpoint = new AWS.Endpoint(esDomain.endpoint);
  let request = new AWS.HttpRequest(endpoint, esDomain.region);

  request.method = 'POST';
  request.path += esDomain.index + '/' + esDomain.doctype + '/';
  request.body = JSON.stringify(doc);
  request.headers['host'] = esDomain.endpoint;
  request.headers['Content-Type'] = 'application/json';
  request.headers['Content-Length'] = Buffer.byteLength(request.body);

  const credentials = new AWS.EnvironmentCredentials('AWS');
  const signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());

  const client = new AWS.HttpClient();
  client.handleRequest(
    request,
    null,
    function (response) {
      console.log(response.statusCode + ' ' + response.statusMessage);
      var responseBody = '';
      response.on('data', function (chunk) {
        responseBody += chunk;
      });
      response.on('end', function (chunk) {
        console.log('Response body: ' + responseBody);
      });
    },
    function (error) {
      console.log('Error: ' + error);
    }
  );
}
