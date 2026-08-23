import { relations } from 'drizzle-orm';
import { users } from './users';
import { userPreferences } from './userpreferences';
import { notificationPreferences } from './notificationpreferences';
import { userRoles } from './userroles';
import { moderatorCommunityScopes } from './moderatorcommunityscopes';
import { editorEntityScopes } from './editorentityscopes';
import { sports } from './sports';
import { leagues } from './leagues';
import { teams } from './teams';
import { leagueTeams } from './leagueteams';
import { athletes } from './athletes';
import { dataSources } from './datasources';
import { dataVerifications } from './dataverifications';
import { games } from './games';
import { scores } from './scores';
import { posts } from './posts';
import { postSports } from './postsports';
import { postLeagues } from './postleagues';
import { postTeams } from './postteams';
import { postAthletes } from './postathletes';
import { postGames } from './postgames';
import { postCommunities } from './postcommunities';
import { favorites } from './favorites';
import { postLikes } from './postlikes';
import { comments } from './comments';
import { userBlocks } from './userblocks';
import { userMutes } from './usermutes';
import { communities } from './communities';
import { communityMemberships } from './communitymemberships';
import { messages } from './messages';
import { pushDevices } from './pushdevices';
import { notifications } from './notifications';
import { reports } from './reports';
import { accountDeletionRequests } from './accountdeletionrequests';
import { userWarnings } from './userwarnings';
import { reportActions } from './reportactions';
import { moderationEscalations } from './moderationescalations';
import { auditEvents } from './auditevents';
import { policyVersions } from './policyversions';
import { policyAcceptances } from './policyacceptances';

export const usersRelations = relations(users, ({ one, many }) => ({
  preferences: one(userPreferences),
  notificationPreferences: one(notificationPreferences),

  roleAssignments: many(userRoles, { relationName: 'userRoleUser' }),
  rolesAssigned: many(userRoles, { relationName: 'userRoleAssignedBy' }),
  rolesApproved: many(userRoles, { relationName: 'userRoleApprovedBy' }),
  rolesRevoked: many(userRoles, { relationName: 'userRoleRevokedBy' }),

  moderatorScopesAssigned: many(moderatorCommunityScopes, {
    relationName: 'moderatorScopeAssignedBy',
  }),
  moderatorScopesApproved: many(moderatorCommunityScopes, {
    relationName: 'moderatorScopeApprovedBy',
  }),

  editorScopesAssigned: many(editorEntityScopes, {
    relationName: 'editorScopeAssignedBy',
  }),
  editorScopesApproved: many(editorEntityScopes, {
    relationName: 'editorScopeApprovedBy',
  }),

  dataVerifications: many(dataVerifications),

  authoredPosts: many(posts, { relationName: 'postAuthor' }),
  scheduledPosts: many(posts, { relationName: 'postScheduler' }),

  pinnedCommunityPosts: many(postCommunities),

  favorites: many(favorites),
  postLikes: many(postLikes),
  comments: many(comments),

  blocksCreated: many(userBlocks, { relationName: 'userBlockBlocker' }),
  blocksReceived: many(userBlocks, { relationName: 'userBlockBlocked' }),

  mutesCreated: many(userMutes, { relationName: 'userMuteUser' }),
  mutesReceived: many(userMutes, { relationName: 'userMuteMuted' }),

  communityMemberships: many(communityMemberships),
  messages: many(messages),
  pushDevices: many(pushDevices),
  notifications: many(notifications),

  reportsSubmitted: many(reports, { relationName: 'reportReporter' }),
  reportsReceived: many(reports, { relationName: 'reportReportedUser' }),
  reportsResolved: many(reports, { relationName: 'reportResolver' }),

  deletionRequests: many(accountDeletionRequests, {
    relationName: 'deletionRequestUser',
  }),
  processedDeletionRequests: many(accountDeletionRequests, {
    relationName: 'deletionRequestProcessor',
  }),

  warningsReceived: many(userWarnings, { relationName: 'userWarningUser' }),
  warningsIssued: many(userWarnings, { relationName: 'userWarningIssuer' }),
  warningsRevoked: many(userWarnings, { relationName: 'userWarningRevoker' }),

  reportActions: many(reportActions),

  escalationsCreated: many(moderationEscalations, {
    relationName: 'escalationCreator',
  }),
  escalationsAssigned: many(moderationEscalations, {
    relationName: 'escalationAssignee',
  }),
  escalationsResolved: many(moderationEscalations, {
    relationName: 'escalationResolver',
  }),

  auditEvents: many(auditEvents),

  policyVersionsCreated: many(policyVersions),
  policyAcceptances: many(policyAcceptances),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one, many }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
    relationName: 'userRoleUser',
  }),

  assignedBy: one(users, {
    fields: [userRoles.assignedByUserId],
    references: [users.id],
    relationName: 'userRoleAssignedBy',
  }),

  approvedBy: one(users, {
    fields: [userRoles.approvedByUserId],
    references: [users.id],
    relationName: 'userRoleApprovedBy',
  }),

  revokedBy: one(users, {
    fields: [userRoles.revokedByUserId],
    references: [users.id],
    relationName: 'userRoleRevokedBy',
  }),

  moderatorCommunityScopes: many(moderatorCommunityScopes),
  editorEntityScopes: many(editorEntityScopes),
}));

export const moderatorCommunityScopesRelations = relations(moderatorCommunityScopes, ({ one }) => ({
  userRole: one(userRoles, {
    fields: [moderatorCommunityScopes.userRoleId],
    references: [userRoles.id],
  }),

  community: one(communities, {
    fields: [moderatorCommunityScopes.communityId],
    references: [communities.id],
  }),

  assignedBy: one(users, {
    fields: [moderatorCommunityScopes.assignedByUserId],
    references: [users.id],
    relationName: 'moderatorScopeAssignedBy',
  }),

  approvedBy: one(users, {
    fields: [moderatorCommunityScopes.approvedByUserId],
    references: [users.id],
    relationName: 'moderatorScopeApprovedBy',
  }),
}));

export const editorEntityScopesRelations = relations(editorEntityScopes, ({ one }) => ({
  userRole: one(userRoles, {
    fields: [editorEntityScopes.userRoleId],
    references: [userRoles.id],
  }),

  sport: one(sports, {
    fields: [editorEntityScopes.sportId],
    references: [sports.id],
  }),

  league: one(leagues, {
    fields: [editorEntityScopes.leagueId],
    references: [leagues.id],
  }),

  team: one(teams, {
    fields: [editorEntityScopes.teamId],
    references: [teams.id],
  }),

  assignedBy: one(users, {
    fields: [editorEntityScopes.assignedByUserId],
    references: [users.id],
    relationName: 'editorScopeAssignedBy',
  }),

  approvedBy: one(users, {
    fields: [editorEntityScopes.approvedByUserId],
    references: [users.id],
    relationName: 'editorScopeApprovedBy',
  }),
}));

export const sportsRelations = relations(sports, ({ many }) => ({
  leagues: many(leagues),
  dataVerifications: many(dataVerifications),
  postSports: many(postSports),
  favorites: many(favorites),
  communities: many(communities),
  editorEntityScopes: many(editorEntityScopes),
}));

export const leaguesRelations = relations(leagues, ({ one, many }) => ({
  sport: one(sports, {
    fields: [leagues.sportId],
    references: [sports.id],
  }),

  leagueTeams: many(leagueTeams),
  games: many(games),
  dataVerifications: many(dataVerifications),
  postLeagues: many(postLeagues),
  favorites: many(favorites),
  communities: many(communities),
  editorEntityScopes: many(editorEntityScopes),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  leagueTeams: many(leagueTeams),
  athletes: many(athletes),

  homeGames: many(games, { relationName: 'gameHomeTeam' }),
  awayGames: many(games, { relationName: 'gameAwayTeam' }),

  winningScores: many(scores),

  dataVerifications: many(dataVerifications),
  postTeams: many(postTeams),
  favorites: many(favorites),
  communities: many(communities),
  editorEntityScopes: many(editorEntityScopes),
}));

export const leagueTeamsRelations = relations(leagueTeams, ({ one, many }) => ({
  league: one(leagues, {
    fields: [leagueTeams.leagueId],
    references: [leagues.id],
  }),

  team: one(teams, {
    fields: [leagueTeams.teamId],
    references: [teams.id],
  }),

  homeGames: many(games, { relationName: 'gameHomeLeagueTeam' }),
  awayGames: many(games, { relationName: 'gameAwayLeagueTeam' }),
}));

export const athletesRelations = relations(athletes, ({ one, many }) => ({
  currentTeam: one(teams, {
    fields: [athletes.currentTeamId],
    references: [teams.id],
  }),

  dataVerifications: many(dataVerifications),
  postAthletes: many(postAthletes),
  favorites: many(favorites),
}));

export const dataSourcesRelations = relations(dataSources, ({ many }) => ({
  verifications: many(dataVerifications),
}));

export const dataVerificationsRelations = relations(dataVerifications, ({ one }) => ({
  source: one(dataSources, {
    fields: [dataVerifications.sourceId],
    references: [dataSources.id],
  }),

  sport: one(sports, {
    fields: [dataVerifications.sportId],
    references: [sports.id],
  }),

  league: one(leagues, {
    fields: [dataVerifications.leagueId],
    references: [leagues.id],
  }),

  team: one(teams, {
    fields: [dataVerifications.teamId],
    references: [teams.id],
  }),

  athlete: one(athletes, {
    fields: [dataVerifications.athleteId],
    references: [athletes.id],
  }),

  game: one(games, {
    fields: [dataVerifications.gameId],
    references: [games.id],
  }),

  score: one(scores, {
    fields: [dataVerifications.scoreId],
    references: [scores.id],
  }),

  post: one(posts, {
    fields: [dataVerifications.postId],
    references: [posts.id],
  }),

  verifiedBy: one(users, {
    fields: [dataVerifications.verifiedByUserId],
    references: [users.id],
  }),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  league: one(leagues, {
    fields: [games.leagueId],
    references: [leagues.id],
  }),

  homeTeam: one(teams, {
    fields: [games.homeTeamId],
    references: [teams.id],
    relationName: 'gameHomeTeam',
  }),

  awayTeam: one(teams, {
    fields: [games.awayTeamId],
    references: [teams.id],
    relationName: 'gameAwayTeam',
  }),

  homeLeagueTeam: one(leagueTeams, {
    fields: [games.leagueId, games.homeTeamId],
    references: [leagueTeams.leagueId, leagueTeams.teamId],
    relationName: 'gameHomeLeagueTeam',
  }),

  awayLeagueTeam: one(leagueTeams, {
    fields: [games.leagueId, games.awayTeamId],
    references: [leagueTeams.leagueId, leagueTeams.teamId],
    relationName: 'gameAwayLeagueTeam',
  }),

  score: one(scores),

  dataVerifications: many(dataVerifications),
  postGames: many(postGames),
}));

export const scoresRelations = relations(scores, ({ one, many }) => ({
  game: one(games, {
    fields: [scores.gameId],
    references: [games.id],
  }),

  winningTeam: one(teams, {
    fields: [scores.winningTeamId],
    references: [teams.id],
  }),

  dataVerifications: many(dataVerifications),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorUserId],
    references: [users.id],
    relationName: 'postAuthor',
  }),

  scheduledBy: one(users, {
    fields: [posts.scheduledByUserId],
    references: [users.id],
    relationName: 'postScheduler',
  }),

  dataVerifications: many(dataVerifications),

  postSports: many(postSports),
  postLeagues: many(postLeagues),
  postTeams: many(postTeams),
  postAthletes: many(postAthletes),
  postGames: many(postGames),
  postCommunities: many(postCommunities),

  likes: many(postLikes),
  comments: many(comments),
  reports: many(reports),
}));

export const postSportsRelations = relations(postSports, ({ one }) => ({
  post: one(posts, {
    fields: [postSports.postId],
    references: [posts.id],
  }),

  sport: one(sports, {
    fields: [postSports.sportId],
    references: [sports.id],
  }),
}));

export const postLeaguesRelations = relations(postLeagues, ({ one }) => ({
  post: one(posts, {
    fields: [postLeagues.postId],
    references: [posts.id],
  }),

  league: one(leagues, {
    fields: [postLeagues.leagueId],
    references: [leagues.id],
  }),
}));

export const postTeamsRelations = relations(postTeams, ({ one }) => ({
  post: one(posts, {
    fields: [postTeams.postId],
    references: [posts.id],
  }),

  team: one(teams, {
    fields: [postTeams.teamId],
    references: [teams.id],
  }),
}));

export const postAthletesRelations = relations(postAthletes, ({ one }) => ({
  post: one(posts, {
    fields: [postAthletes.postId],
    references: [posts.id],
  }),

  athlete: one(athletes, {
    fields: [postAthletes.athleteId],
    references: [athletes.id],
  }),
}));

export const postGamesRelations = relations(postGames, ({ one }) => ({
  post: one(posts, {
    fields: [postGames.postId],
    references: [posts.id],
  }),

  game: one(games, {
    fields: [postGames.gameId],
    references: [games.id],
  }),
}));

export const postCommunitiesRelations = relations(postCommunities, ({ one }) => ({
  post: one(posts, {
    fields: [postCommunities.postId],
    references: [posts.id],
  }),

  community: one(communities, {
    fields: [postCommunities.communityId],
    references: [communities.id],
  }),

  pinnedBy: one(users, {
    fields: [postCommunities.pinnedByUserId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),

  sport: one(sports, {
    fields: [favorites.sportId],
    references: [sports.id],
  }),

  league: one(leagues, {
    fields: [favorites.leagueId],
    references: [leagues.id],
  }),

  team: one(teams, {
    fields: [favorites.teamId],
    references: [teams.id],
  }),

  athlete: one(athletes, {
    fields: [favorites.athleteId],
    references: [athletes.id],
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),

  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),

  author: one(users, {
    fields: [comments.authorUserId],
    references: [users.id],
  }),

  parentComment: one(comments, {
    fields: [comments.parentCommentId, comments.postId],
    references: [comments.id, comments.postId],
    relationName: 'commentReplies',
  }),

  replies: many(comments, {
    relationName: 'commentReplies',
  }),

  reports: many(reports),
}));

export const userBlocksRelations = relations(userBlocks, ({ one }) => ({
  blocker: one(users, {
    fields: [userBlocks.blockerUserId],
    references: [users.id],
    relationName: 'userBlockBlocker',
  }),

  blocked: one(users, {
    fields: [userBlocks.blockedUserId],
    references: [users.id],
    relationName: 'userBlockBlocked',
  }),
}));

export const userMutesRelations = relations(userMutes, ({ one }) => ({
  user: one(users, {
    fields: [userMutes.userId],
    references: [users.id],
    relationName: 'userMuteUser',
  }),

  mutedUser: one(users, {
    fields: [userMutes.mutedUserId],
    references: [users.id],
    relationName: 'userMuteMuted',
  }),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  linkedSport: one(sports, {
    fields: [communities.linkedSportId],
    references: [sports.id],
  }),

  linkedLeague: one(leagues, {
    fields: [communities.linkedLeagueId],
    references: [leagues.id],
  }),

  linkedTeam: one(teams, {
    fields: [communities.linkedTeamId],
    references: [teams.id],
  }),

  moderatorCommunityScopes: many(moderatorCommunityScopes),
  postCommunities: many(postCommunities),
  memberships: many(communityMemberships),
  messages: many(messages),
  warnings: many(userWarnings),
}));

export const communityMembershipsRelations = relations(communityMemberships, ({ one, many }) => ({
  community: one(communities, {
    fields: [communityMemberships.communityId],
    references: [communities.id],
  }),

  user: one(users, {
    fields: [communityMemberships.userId],
    references: [users.id],
  }),

  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  community: one(communities, {
    fields: [messages.communityId],
    references: [communities.id],
  }),

  sender: one(users, {
    fields: [messages.senderUserId],
    references: [users.id],
  }),

  membership: one(communityMemberships, {
    fields: [messages.communityId, messages.senderUserId],
    references: [communityMemberships.communityId, communityMemberships.userId],
  }),

  reports: many(reports),
}));

export const pushDevicesRelations = relations(pushDevices, ({ one }) => ({
  user: one(users, {
    fields: [pushDevices.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reporter: one(users, {
    fields: [reports.reporterUserId],
    references: [users.id],
    relationName: 'reportReporter',
  }),

  reportedUser: one(users, {
    fields: [reports.reportedUserId],
    references: [users.id],
    relationName: 'reportReportedUser',
  }),

  reportedPost: one(posts, {
    fields: [reports.reportedPostId],
    references: [posts.id],
  }),

  reportedComment: one(comments, {
    fields: [reports.reportedCommentId],
    references: [comments.id],
  }),

  reportedMessage: one(messages, {
    fields: [reports.reportedMessageId],
    references: [messages.id],
  }),

  resolvedBy: one(users, {
    fields: [reports.resolvedByUserId],
    references: [users.id],
    relationName: 'reportResolver',
  }),

  warnings: many(userWarnings),
  actions: many(reportActions),
  escalations: many(moderationEscalations),
}));

export const accountDeletionRequestsRelations = relations(accountDeletionRequests, ({ one }) => ({
  user: one(users, {
    fields: [accountDeletionRequests.userId],
    references: [users.id],
    relationName: 'deletionRequestUser',
  }),

  processedBy: one(users, {
    fields: [accountDeletionRequests.processedByUserId],
    references: [users.id],
    relationName: 'deletionRequestProcessor',
  }),
}));

export const userWarningsRelations = relations(userWarnings, ({ one }) => ({
  user: one(users, {
    fields: [userWarnings.userId],
    references: [users.id],
    relationName: 'userWarningUser',
  }),

  community: one(communities, {
    fields: [userWarnings.communityId],
    references: [communities.id],
  }),

  issuedBy: one(users, {
    fields: [userWarnings.issuedByUserId],
    references: [users.id],
    relationName: 'userWarningIssuer',
  }),

  report: one(reports, {
    fields: [userWarnings.reportId],
    references: [reports.id],
  }),

  revokedBy: one(users, {
    fields: [userWarnings.revokedByUserId],
    references: [users.id],
    relationName: 'userWarningRevoker',
  }),
}));

export const reportActionsRelations = relations(reportActions, ({ one }) => ({
  report: one(reports, {
    fields: [reportActions.reportId],
    references: [reports.id],
  }),

  actor: one(users, {
    fields: [reportActions.actorUserId],
    references: [users.id],
  }),
}));

export const moderationEscalationsRelations = relations(moderationEscalations, ({ one }) => ({
  report: one(reports, {
    fields: [moderationEscalations.reportId],
    references: [reports.id],
  }),

  escalatedBy: one(users, {
    fields: [moderationEscalations.escalatedByUserId],
    references: [users.id],
    relationName: 'escalationCreator',
  }),

  assignedTo: one(users, {
    fields: [moderationEscalations.assignedToUserId],
    references: [users.id],
    relationName: 'escalationAssignee',
  }),

  resolvedBy: one(users, {
    fields: [moderationEscalations.resolvedByUserId],
    references: [users.id],
    relationName: 'escalationResolver',
  }),
}));

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  actor: one(users, {
    fields: [auditEvents.actorUserId],
    references: [users.id],
  }),
}));

export const policyVersionsRelations = relations(policyVersions, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [policyVersions.createdByUserId],
    references: [users.id],
  }),

  acceptances: many(policyAcceptances),
}));

export const policyAcceptancesRelations = relations(policyAcceptances, ({ one }) => ({
  user: one(users, {
    fields: [policyAcceptances.userId],
    references: [users.id],
  }),

  policyVersion: one(policyVersions, {
    fields: [policyAcceptances.policyVersionId],
    references: [policyVersions.id],
  }),
}));
