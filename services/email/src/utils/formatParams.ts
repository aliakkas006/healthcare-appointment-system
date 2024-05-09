import { TransformableInfo } from 'logform';

// Format params
const formatParams = ({
  timestamp,
  level,
  message,
  ...args
}: TransformableInfo): string => {
  const ts = timestamp.slice(0, 19).replace('T', ' ');
  return `${ts} [${level}]: ${message} ${
    Object.keys(args).length > 0 ? JSON.stringify(args) : ''
  }`;
};

export default formatParams;
