const services = ["S3", "Lambda", "DynamoDB", "API Gateway", "CloudFront", "IAM", "EC2", "Amplify", "Bedrock", "Step Functions", "ECS", "RDS", "Cognito", "EventBridge"];
/** Two copies of the list so the loop is seamless; pauses on hover; wraps statically under reduced motion. */
export default function Marquee() {
  const list = [...services, ...services];
  return (<div className="marquee" aria-label="AWS services members have shipped with"><div className="marquee-track">{list.map((s, i) => <span key={i} className="chip" aria-hidden={i >= services.length}><i className="dot" />{s}</span>)}</div></div>);
}
