import { ImageResponse } from 'next/og';

import { CONSTANTS } from '@/lib/constants';
import { verifySignature } from '@/lib/utils';

// export const runtime = 'edge';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const signature = searchParams.get('hash');

  if ((title && !signature) || (title && signature && !verifySignature(title, signature))) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(0deg, #f0ffff 0%, #f8f9fa 50%, #e9ecef 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: '#2c3e50',
          padding: '40px',
        }}
      >
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '62px',
              fontWeight: 'bold',
            }}
          >
            <AppNameElement />
          </div>
        )}

        {/* Main title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            display: 'flex',
            textAlign: 'center',
            maxWidth: '1000px',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {title && title}
          {!title && <AppNameElement />}
        </div>

        {/* Bottom text */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '32px',
            fontWeight: 'normal',
            textAlign: 'center',
            color: '#495057',
            maxWidth: '1200px',
            lineHeight: '1.3',
          }}
        >
          - ライブ映像から現在の天気・傘・服装を解析 -
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

const AppNameElement = () => {
  return (
    <>
      {/* Weather icon using SVG */}
      <div
        style={{
          width: '76px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='76'
          height='76'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-cloud-sun-icon lucide-cloud-sun'
        >
          <path d='M12 2v2' />
          <path d='m4.93 4.93 1.41 1.41' />
          <path d='M20 12h2' />
          <path d='m19.07 4.93-1.41 1.41' />
          <path d='M15.947 12.65a4 4 0 0 0-5.925-4.128' />
          <path d='M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z' />
        </svg>
      </div>

      <span>{CONSTANTS.APP_NAME}</span>
    </>
  );
};
