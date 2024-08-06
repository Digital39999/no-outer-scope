const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-outer-scope');

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
});

ruleTester.run('no-outer-scope', rule, {
	valid: [
		{
			code: `
        callbackFunction(({ v }) => {
          return v;
        }, { v: 1 });
      `,
		},
	],
	invalid: [
		{
			code: `
        const variable = 1;
        callbackFunction(() => {
          return variable;
        });
      `,
			errors: [{ message: 'Variable "variable" is accessed from outer scope.' }],
		},
		{
			code: `
        const variable = 1;
        callbackFunction(({ v }) => {
          return variable + v;
        }, {
          v: 1,
        });
      `,
			errors: [{ message: 'Variable "variable" is accessed from outer scope.' }],
		},
	],
});