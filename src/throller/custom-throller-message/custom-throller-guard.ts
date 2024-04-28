import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { ThrottlerException, ThrottlerGenerateKeyFunction, ThrottlerGetTrackerFunction, ThrottlerGuard, ThrottlerOptions } from "@nestjs/throttler";
import { ThrottlerLimitDetail } from "@nestjs/throttler/dist/throttler.guard.interface";

export class CustomThrollerGuard extends ThrottlerGuard {
    public throwThrottlingException(context: ExecutionContext, ): Promise<void>{
        throw new ThrottlerException("Limite de request por minuto atingido. Tem em instantes.")
    }

    public async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: ThrottlerOptions, getTracker: ThrottlerGetTrackerFunction, generateKey: ThrottlerGenerateKeyFunction): Promise<boolean>{
        // const client = context.switchToWs().getClient()
        // //const ip = client.conn.remoteAddress
        // console.log(this.storageService);
        // console.log(this.getTracker);
        // this.storageService['_storage'] = {request: 1}
        // const key = generateKey(context, String(limit++), 'limit')
        // const test = {'ip': key};
        // const ttls = await this.getTracker(test)

        // if (ttls.length >= limit) {
        // throw new ThrottlerException()
        // }

        // //const key = this.generateKey(context, String(limit++), 'limit')
        // return true
        try {
            const { req} = this.getRequestResponse(context);
            if(!req.originalUrl.includes('/test')){
                return true;
            }
            await super.handleRequest(context, limit, ttl, throttler, getTracker, generateKey);
            // deixar limite sistema por conta da implementação do nestjs
            // criar codigo para validar documento chave documento quantidade
            console.log(req.params.doc)
            console.log(req.params.key)
            if(throttler.name === 'doc-chave'){
                console.log(this.storageService)
                console.log('documento chave')
            }
            console.log(this.storageService)
        } catch (error) {
            //throw error
           this.throwThrottlingException(context )
        }
        console.log("do my things")
        return true;
    }
}
