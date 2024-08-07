import { Rule } from 'eslint';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow accessing variables from outer scope in specified callback functions',
            category: 'Possible Errors',
            recommended: true,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    functions: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        minItems: 1,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const functionNames = options.functions || [
            'callbackFunction',
            'broadcastEval',
            'evalOnManager',
            'eval',
            'evalOnClient',
            'evalOnGuild',
            'evalOnClusterClient',
            'evalOnCluster'
        ];

        return {
            CallExpression(call) {
                if (call.callee.type !== 'Identifier' && call.callee.type !== 'MemberExpression') return;

                const name = call.callee.type === 'MemberExpression' ? 'name' in call.callee.property ? call.callee.property.name : null : call.callee.name;
                if (!functionNames.includes(name)) return;

                if (call.arguments.length === 0) return;

                for (const arg of call.arguments) {
                    if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
                        const sourceCode = Object.hasOwn(context, 'sourceCode') ? context.sourceCode : context.getSourceCode();
                        const variables = sourceCode.getScope(arg).through;

                        for (const variable of variables) {
                            if (variable.resolved?.scope.type === 'global') continue;

                            context.report({
                                node: arg,
                                message: `Variable "${variable.identifier.name}" is accessed from outer scope.`,
                            });
                        }
                    }

                    if (arg.type === 'ObjectExpression') {
                        for (const prop of arg.properties) {
                            if (prop.type === 'Property' && prop.value.type === 'ArrowFunctionExpression') {
                                const sourceCode = Object.hasOwn(context, 'sourceCode') ? context.sourceCode : context.getSourceCode();
                                const variables = sourceCode.getScope(prop.value).through;

                                for (const variable of variables) {
                                    if (variable.resolved?.scope.type === 'global') continue;

                                    context.report({
                                        node: prop.value,
                                        message: `Variable "${variable.identifier.name}" is accessed from outer scope.`,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        };
    },
} as Rule.RuleModule;