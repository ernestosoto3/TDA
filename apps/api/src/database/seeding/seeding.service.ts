import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { communities, leagues, posts, sports, teams, users } from '../schema';

@Injectable()
export class SeedingService {
  constructor(private readonly dbService: DatabaseService) {}

  async seeding(): Promise<void> {
    /*clear*/
    await this.clear();

    /*Teams*/
    const inserted_teams = await this.dbService.db.insert(teams).values([
      {
        officialName: 'Cangrejeros',
        city: 'santurce',
        logoUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCKHQEClnd-6OZCO1d8a1JulQGSbsqdoeOwwiE9mTS1g&s=10',
      },
      {
        officialName: 'Leones',
        city: 'Ponce',
        logoUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQr3K0maAGFxd5RxbYmS2nhdAntZqla0s3bRXr7FATFw&s=10',
      },
    ]).returning();
    const firstTeam = inserted_teams[0];
    const secondTeam = inserted_teams[1];

    if(!firstTeam || !secondTeam){
      throw new Error('Failed to seed teams');
    }

    /*Users*/
    const inserted_users = await this.dbService.db
      .insert(users)
      .values([
        {
          clerkId: 'dev_clerk_user_001',
          email: 'user001@gmail.com',
          username: 'user001',
          firstName: 'user001_firstname',
          lastName: 'user001_lastname',
        },
        {
          clerkId: 'dev_clerk_user_002',
          email: 'user002@gmail.com',
          username: 'user002',
          firstName: 'user002_firstname',
          lastName: 'user002_lastname',
        },
      ]).returning();

      const firstUser = inserted_users[0];
      const secondUser = inserted_users[1];

      if (!firstUser || !secondUser) {
        throw new Error('Failed to seed users');
      }

    /*Posts */
    await this.dbService.db.insert(posts).values([
      {
        authorUserId: firstUser.id,
        contentType: 'post',
        title: 'post001_title',
        content: 'post001_content',
      },
      {
        authorUserId: secondUser.id,
        contentType: 'post',
        title: 'post002_title',
        content: 'post002_content',
      },
    ]);

    /*sports */
    const inserted_sports = await this.dbService.db.insert(sports).values([
    {
      name: 'Baloncesto',
      iconUrl : 'https://i.pinimg.com/736x/95/c4/1b/95c41b6ea0ff51e05af678a0b92cf7cc.jpg',
      status : 'draft',
    },
    {
      name : 'Baseball',
      iconUrl : 'https://img.magnific.com/free-photo/baseball_23-2152015627.jpg?semt=ais_hybrid&w=740&q=80',
      status : 'draft'
    }
  ]).returning();

    const firstSport = inserted_sports[0];
    const secondSport = inserted_sports[1];

      if (!firstSport || !secondSport) {
        throw new Error('Failed to seed sports');
      }
  
  /*leagues */

  const inserted_leagues = await this.dbService.db.insert(leagues).values([
   {
    sportId : firstSport.id,
    name : 'Baloncesto Superior Nacional',
    seasonLabel : '2026-2027',
    logoUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4SPQ3i0vLZrDnr8xGvUTxTmOUs0LDL5aC3vwLFSOcz1PKA3iM3sfm10&s=10',
    status : 'upcoming'
   },
   {
    sportId : secondSport.id,
    name : 'Liga de Beisbol Superior Doble A',
    seasonLabel : '2026-2027',
    logoUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXx0trJW3NWBGOjldS1YRJSdjRMZobyxm2XB3ElIMDYSlZcaVV8HaNlbiR&s=10',
    status : 'upcoming'
   }
  ]).returning();

  const firstLeague = inserted_leagues[0];
  const secondLeague = inserted_leagues[1];

  if(!firstLeague || !secondLeague){
    throw new Error('Failed to seed leagues');
  }
  
  /*communities */
  await this.dbService.db.insert(communities).values([
    {
    name : 'Comunidad de Baloncesto',
    slug:'comunidad-de-baloncesto',
    linkedSportId : firstSport.id,
    status:'active',
  },

  {
    name : 'Comunidad de Baseball',
    slug: 'comunidad-de-baseball',
    linkedSportId : secondSport.id,
    status:'active'
  }
]);


  }

  async clear(): Promise<void> {
    await this.dbService.db.delete(communities);
    await this.dbService.db.delete(posts);
    await this.dbService.db.delete(leagues);
    await this.dbService.db.delete(users);
    await this.dbService.db.delete(teams);
    await this.dbService.db.delete(sports);
  }
}
