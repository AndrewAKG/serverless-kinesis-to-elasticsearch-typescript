/* == Globals == */
export const esDomain = {
  region: process.env.DOMAIN_REGION || 'eu-west-3',
  endpoint: process.env.DOMAIN_ENDPOINT,
  index: 'kinesis-index',
  doctype: 'kinesis-type'
};
