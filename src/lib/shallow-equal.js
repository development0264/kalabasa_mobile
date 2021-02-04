export default function shallowEqual(a, b) {
	if (Object.keys(a).length != Object.keys(b).length) return false;
	var result = true;
	Object.values(a).forEach((aValue, aKey) => {
		if (b[aKey] === undefined || b[aKey] !==  aValue) result = false;
	});
	return result;
};