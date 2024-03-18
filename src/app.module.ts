import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import * as cors from 'cors';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: `https://${process.env.USER_DOMAIN}/graphql` || 'http://localhost:3000/graphql',
            },
            {
              name: 'tickets',
              url:  `https://${process.env.TICKET_DOMAIN}/graphql` || 'http://localhost:3003/graphql',
            },
            {
              name: 'institutions',
              url: `https://${process.env.INSTITUTION_DOMAIN}/graphql` || 'http://localhost:3004/graphql',
            }
          ],
        }),
      },
    

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
//export class AppModule { }

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
