
import billableOptions from '@/config/billableOptions';
import MainView from '@/components/MainView';

export const metadata = {
  title: process.env.FRAME_NAME || 'Billable Hours Frame',
  description: 'Accept payments for your time, directly in a Farcaster frame.',
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: process.env.FRAME_IMAGE_URL,
      button: {
        title: "Launch",
        action: {
          type: "launch_frame",
          name: process.env.FRAME_NAME || 'Billable Hours Frame',
          url: process.env.APP_URL,
          splashImageUrl: process.env.SPLASH_IMAGE_URL,
          splashBackgroundColor: process.env.SPLASH_BACKGROUND_COLOR
        }
      }
    })
  }
};

export default function Page() {
  return (
    <MainView
      billableOptions={billableOptions}
      frameName={process.env.FRAME_NAME || 'Billable Hours Frame'}
      appUrl={process.env.APP_URL}
      recipientAddress={process.env.RECIPIENT_ADDRESS}
      usdcContractAddress={process.env.USDC_CONTRACT_ADDRESS}
    />
  );
}
