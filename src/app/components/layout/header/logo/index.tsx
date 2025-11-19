import Image from 'next/image';
import Link from 'next/link';
import { getImgPath } from '@/utils/pathUtils';

const Logo: React.FC = () => {

  return (
    <Link href="/">
      <Image
        src={getImgPath("/images/logo/01.png")}
        alt="logo"
        width={160}
        height={50}
        style={{ width: '150px', height: '55px', transform: "rotate(2deg)" }}
        quality={100}
        className='dark:hidden'
      />
      <Image
        src={getImgPath("/images/logo/logo.jpg")}
        alt="logo"
        width={160}
        height={50}
        style={{ width: 'auto', height: 'auto' }}
        quality={100}
        className='dark:block hidden'
      />
    </Link>
  );
};

export default Logo;