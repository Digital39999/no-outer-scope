module.exports = {
	meta: {
		type: "problem",
		docs: {
			description: "disallow accessing variables from outer scope in specified callback functions",
			category: "Possible Errors",
			recommended: true,
		},
		schema: [
			{
				type: "object",
				properties: {
					functions: {
						type: "array",
						items: {
							type: "string",
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

		const functionNames = options.functions || ["callbackFunction", "broadcastEval", "evalOnManager", "eval", "evalOnClient", "evalOnGuild", "evalOnClusterClient", "evalOnCluster"];

		const parser = (node) => {
			const callbackScope = context.getScope();
			const everythingOutside = callbackScope.upper.variables;

			for (const variable of everythingOutside) {
				const references = variable.references;
				for (const reference of references) {
					if (reference.from !== callbackScope) {
						context.report({
							node: reference.identifier,
							message: `Variable "${variable.name}" is accessed from outer scope.`,
						});
					}
				}
			}
		};

		const object = {};

		for (const functionName of functionNames) {
			object[`CallExpression[callee.name="${functionName}"] > ArrowFunctionExpression`] = parser;
		}

		return object;
	},
};
