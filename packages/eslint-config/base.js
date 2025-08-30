import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import onlyWarn from 'eslint-plugin-only-warn';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
	js.configs.recommended,
	eslintConfigPrettier,
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		plugins: {
			turbo: turboPlugin,
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'warn',
		},
	},
	{
		plugins: {
			onlyWarn,
		},
	},
	{
		ignores: ['dist/**'],
	},
];
