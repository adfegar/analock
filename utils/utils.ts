import { colorGreen, colorPink, colorPurple } from "../constants/constants"

/**
 * Gets a randomly generated number that is inside the given interval (inclusive) 
 * 
 * @param minInclusive the minimum the minimum value in the interval
 * @param maxInclusive the maximum value in the interval
 * @returns a randomly generated number that is inside the given interval 
 */
export function generateRandomNumberInInterval(minInclusive: number, maxInclusive: number): number {
    return Math.floor(Math.random() * maxInclusive + minInclusive)
}


/**
 * Gets the column located on the matrix's given index. 
 * @param matrix the matrix 
 * @param columnIndex the index to get the column from
 * @returns the column 
 */
export function getMatrixColumn(matrix: any[][], columnIndex: number): any[] {
    return matrix.map(row => row[columnIndex])
}

/**
 * 
 * Sets the value of the column located at the given index.
 * @param matrix the matrix
 * @param updatedColumn the column to replace the current one
 * @param columnIndex the index to update the column
 */
export function setMatrixColumn(matrix: any[][], updatedColumn: any[], columnIndex: number): void {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i][columnIndex] = updatedColumn[i]
    }
}

/**
 * Gets the color of given activity index.
 * 
 * @param index the index
 * @returns the color string 
 */
export function getActivityColorFromIndex(index: number): string {
    if (index === 0) {
        return colorPurple
    } else if (index === 2) {
        return colorGreen
    } else {
        return colorPink
    }
}