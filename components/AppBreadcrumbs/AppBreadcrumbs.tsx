import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumbs, Link as MUILink, Typography } from '@mui/material';
import Link from 'next/link';

const defaultGetDefaultTextGenerator = (path) => path;
const defaultGetTextGenerator = (param, query) => null;

// Pulled out the path part breakdown because its
// going to be used by both `asPath` and `pathname`
const generatePathParts = (pathStr) => {
  const pathWithoutQuery = pathStr.split('?')[0];
  return pathWithoutQuery.split('/').filter((v) => v.length > 0);
};

const AppBreadcrumbs = ({
  getTextGenerator = defaultGetTextGenerator,
  getDefaultTextGenerator = defaultGetDefaultTextGenerator,
}) => {
  const { asPath, pathname, query } = useRouter();

  const breadcrumbs = useMemo(() => {
    const asPathNestedRoutes = generatePathParts(asPath);
    const pathnameNestedRoutes = generatePathParts(pathname);

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      // Pull out and convert "[post_id]" into "post_id"
      const param = pathnameNestedRoutes[idx].replace('[', '').replace(']', '');

      const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');

      return {
        href,
        textGenerator: getTextGenerator(param, query),
        text: getDefaultTextGenerator(subpath),
      };
    });

    return [{ href: '/', text: 'Home' }, ...crumbList];
  }, [asPath, pathname, query, getTextGenerator, getDefaultTextGenerator]);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ bgcolor: '#ecf0f1', borderBottom: '1px solid #ecf0f1', p: 2 }}
    >
      {breadcrumbs.map((crumb, index) => (
        <Crumb key={index} last={index === breadcrumbs.length - 1} {...crumb} />
      ))}
    </Breadcrumbs>
  );
};

const Crumb = ({ text: defaultText, textGenerator, href, last = false }) => {
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    (async () => {
      // If `textGenerator` is nonexistent, then don't do anything
      if (!Boolean(textGenerator)) return;

      // Run the text generator and set the text again
      const finalText = await textGenerator();
      setText(finalText);
    })();
  }, [textGenerator]);

  if (last) return <Typography color="text.primary">{text}</Typography>;

  return (
    <Link href={href} passHref>
      <MUILink color="inherit" href={href} underline="hover">
        {text}
      </MUILink>
    </Link>
  );
};

export default AppBreadcrumbs;
