/**
 * clase encargada de contruir la repuesta estandar
 */

export class ResponseHelper {
    /**
     * respuesta exitosa
     */

    static success(
        data: any,
        statusCode = 200,
    ) {
        return {
            success: true,
            statusCode,
            data,
        }
    } 

    /**
     * respuesta de error
     */
    static error(
        data: any,
        statusCode = 400,
    ) {
        return {
            success: false,
            statusCode,
            data,
        }
    }
    
}