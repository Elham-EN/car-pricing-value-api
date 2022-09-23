import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Validate any incoming request from the client. The whitelist property
  //to make sure that incoming requests don't have unrelated properties that
  //we are not expecting. This is because of security reason we don't want to
  //allow users to add in additional properties in the incoming request.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
