import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RouteGuard = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  const authCheck = (url: string) => {
    // redirect to signin page if accessing a private page and not logged in
    const publicPaths = ['/signin'];
    const path = url.split('?')[0];
    const userService = {
      userValue: null,
    };

    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/signin',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  };

  return authorized && children;
};

export default RouteGuard;
