/**
 * Date: 11/26/19
 * Time: 9:39 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * Creates all permutations of the input array
 */
export function permutations<T>(items: T[]): T[][] {
	if(items.length <= 1) {
		return [items];
	} else {
		const result: T[][] = [];
		for(let index = 0; index < items.length; index++) {
			const reduced = items.slice(0, index)
				.concat(items.slice(index + 1));
			permutations(reduced).forEach(permutation => {
				result.push([items[index]].concat(permutation));
			});
		}
		return result;
	}
}
