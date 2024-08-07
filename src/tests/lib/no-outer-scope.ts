import rule from '../../lib/no-outer-scope';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},
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
		{
			code: `
				nested.test.callbackFunction(({ v }) => {
					Object.keys({ v });
					return v;
				}, { v: 1 });
			`,
		},
	],
	invalid: [
		{
			code: `
        		const example = 1;
        		callbackFunction(() => {
					const test = 2;
          			return example  + test;
        		});
      		`,
			errors: [{ message: 'Variable "example" is accessed from outer scope.' }],
		},
		{
			code: `
        		const example = 1;
        		nested.test.callbackFunction(({ v }) => {
          			return example + v;
        		}, {
          			v: 1,
        		});
      		`,
			errors: [{ message: 'Variable "example" is accessed from outer scope.' }],
		},
	],
});