/**
 * Interceptor can be use to intercept incoming requests and/or outgoing responses
 * We can think of Interceptor as being similar to middleware
 *
 * class CustomInterceptor
 * method: intercept(context: ExecutionContext, next: CallHandler)
 * This method is going to be called automatically any time our interceptor needs
 * to run. So handle incoming request or outgoing response.
 *
 * context agrument is a wrapper around some information on the incoming request
 *
 * next argument is rxjs Observable (Observable: represents the idea of an invokable
 * collection of future values or events), it's kind of route handler
 *
 * which you can use to invoke the route handler method at some point in your
 * interceptor.
 *
 * Serialize
 * Serialization is a process that happens before objects are returned in a network
 * response. This is an appropriate place to provide rules for transforming and sanitizing
 * the data to be returned to the client. For example, sensitive data like passwords
 * should always be excluded from the response.
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

/**
 * Implements is not same as extends, we make use of extends whenever we are subclassing
 * an existing class. We make use of implements anytime that we want to create a new
 * class that satisfies all the requirements of either an abstract class or an interface.
 * By implementing NestInterceptor, TypeScript is going to check all the methods that
 * exist in this interface, then going to make sure that our class properly implements all
 * those different properties and methods.
 *
 * Purpose of this class: We are going to take response that's coming out of the
 * request handler and currently the data that is coming is the instance of User
 * entity by default Nest is going to turn it into JSON for us. But we are to
 * hijack that process, we are going to convert the user entity instance into DTO
 * instance and DTO will have all different serialization rules. It's going to have
 * the rule that says, ok show id and email but not the password and then turn it
 * into JSON automactially and send back in the response.
 *
 * We are going to list properties inside of the DTO that we want to include in
 * our out going response. Things that we want to share to the requesters.
 *
 * Whenever we get in a user entity instance, we are going to convert it into instance
 * of user DTO and return it from this interceptor class. When Nest trying to serialize
 * the dto object, to turn it into json and the decarator rules will be applied in the
 * UserDto class, which expose ID and Email but not the password
 */
export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run code before an incoming request is handled by the request handler
    //intercept incoming request
    //console.log('Im running before the handler', context);

    //If we want to run some code after we have ran our request route handler. To
    //intercept outgoing response
    return handler.handle().pipe(
      map((data: any) => {
        //Run code before the response is sent out to the the requester (client)
        //The data argument we sent back in the outgoing response.
        //console.log('Im running before the response is sent out', data);
        //data argument is the user entity instance and turn it into the instance
        //of user dto.
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
