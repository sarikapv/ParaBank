import { APIResponse, TestInfo } from '@playwright/test';
 
// TEMPORARY: used only while exploring negative cases. Once the real status and message are known,
// the test switches to exact assertions and this helper is no longer called.
// "I don't know what this endpoint actually returns, show me," and once you've seen the real 
// status and body, you hardcode that known, confirmed value as a proper assertion in your real test, and the capture step gets removed for that case.

export async function captureResponse(testInfo: TestInfo,label: string,response: APIResponse): Promise<void> {
  
  const text = await response.text();
  const line = `[${label}] status=${response.status()} body=${text}`;
  console.log(line);
  await testInfo.attach(label, { body: line, contentType: 'text/plain' });
}