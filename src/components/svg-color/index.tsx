import { Box } from '@mui/material';

type SvgColorProps = {
  src: string;
  sx?: object;
};

export function SvgColor({ src, sx }: SvgColorProps) {
  return (
    <Box
      component="span"
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        backgroundColor: 'currentColor',
        ...sx,
      }}
    />
  );
}
