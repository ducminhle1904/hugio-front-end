const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../remotes/analysis/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../remotes/cashbook/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../remotes/product/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../remotes/summary/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../remotes/user/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../remotes/auth/src/**/!(*.stories|*.spec).{ts,html}'),
    join(
      __dirname,
      '../../libs/feature/src/lib/**/!(*.stories|*.spec).{ts,html}'
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
