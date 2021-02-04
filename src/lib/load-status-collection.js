'use strict'

class LoadStatusCollection
{
	constructor(state)
	{
		state = state ? state : {};
		this.operation = state['operation'] !== undefined ? state['operation'] : null;
		this.children = state['children'] ? state['children'] : [];
	}

	isRunning()
	{
		var result = false;
		for (var x = 0; x < this.children.length; x++) {
			if (this.children[x].isRunning()) {
				result = true; 
				break;
			}
		}
		return result;
	}

	isDone()
	{
		var result = true;
		for (var x = 0; x < this.children.length; x++) {
			if (!this.children[x].isDone()) {
				result = false; 
				break;
			}
		}
		return result;
	}

	hasError()
	{
		var result = false;
		for (var x = 0; x < this.children.length; x++) {
			if (this.children[x].hasError()) {
				result = true; 
				break;
			}
		}
		return result;
	}

	getError()
	{
		var errors = [];
		for (var x = 0; x < this.children.length; x++) {
			if (this.children[x].hasError()) errors.push(this.children[x].getError());
		}
		return errors;
	}

	hasValue()
	{
		var result = false;
		for (var x = 0; x < this.children.length; x++) {
			if (this.children[x].hasValue()) {
				result = true; 
				break;
			}
		}
		return result;
	}

	getValue()
	{
		var values = [];
		for (var x = 0; x < this.children.length; x++) {
			if (this.children[x].hasValue()) values.push(this.children[x].getValue());
		}
		return values;
	}

	getOperation()
	{
		return this.operation;
	}

	static create(children, operation)
	{
		return new LoadStatusCollection({children, operation});
	}
}

LoadStatusCollection.OPERATION_LOADING = 'LOADING';

module.exports = LoadStatusCollection;
