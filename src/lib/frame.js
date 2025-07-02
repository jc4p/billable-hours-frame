
import * as frame from '@farcaster/frame-sdk'

export async function initializeFrame() {
  const context = await frame.sdk.context

  if (!context || !context.user) {
    console.log('not in frame context')
    return
  }

  let user = context.user;
  if (user.user) {
    user = user.user
  }

  window.userFid = user.fid;

  // You can now use the window.userFid in any of your React code, e.g. using a useEffect that listens for it to be set
  // or trigger a custom event or anything you want

  // Call the ready function to remove your splash screen when in a frame
  await frame.sdk.actions.ready();
}
