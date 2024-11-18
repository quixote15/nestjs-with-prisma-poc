import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache/redisCache';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory:  async () => {
        const store = await redisStore({
          url: 'redis://localhost:6379',
        })
        return {
          store,
          ttl: 30 * 1000,
        }
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
