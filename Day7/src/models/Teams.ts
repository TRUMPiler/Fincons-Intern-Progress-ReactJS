export type Teams={
    id:number;
    teamLead:number;
    members:number[];
    teamName:string;
}
export const isMemberInAnyTeam = (memberId: number, excludeTeamId?: number): boolean => {
    const teams = getTeams();
    if (!teams) return false;
    return teams.some(team => 
        (excludeTeamId === undefined || team.id !== excludeTeamId) && 
        team.members.includes(memberId)
    );
};

export const createTeam = (teamName: string, teamLead: number, members: number[]): Teams | null => {
    const storedTeams = localStorage.getItem("teams");
    const teams: Teams[] = storedTeams ? JSON.parse(storedTeams) : [];

    const teamNameExists = teams.some(team => team.teamName === teamName);
    if (teamNameExists) {
        return null;
    }

    for (const memberId of members) {
        if (isMemberInAnyTeam(memberId)) {
            return null;
        }
    }

    const maxId = teams.length > 0
        ? Math.max(...teams.map(t => t.id))
        : 0;

    const newTeam: Teams = {
        id: maxId + 1,
        teamName,
        teamLead,
        members
    };

    teams.push(newTeam);
    localStorage.setItem("teams", JSON.stringify(teams));

    return newTeam;
};

export const getTeams = (): Teams[] | null => {
    const storedTeams = localStorage.getItem("teams");
    if (!storedTeams || storedTeams.length === 0) {
        return null;
    }
    return JSON.parse(storedTeams);
};

export const getTeamById = (id: number): Teams | null => {
    const teams = getTeams();
    if (!teams) return null;
    const foundTeam = teams.find(team => team.id === id);
    return foundTeam || null;
};

export const getTeamsByLead = (leadId: number): Teams[] | null => {
    const teams = getTeams();
    if (!teams) return null;
    const userTeams = teams.filter(team => team.teamLead === leadId);
    return userTeams.length > 0 ? userTeams : null;
};

export const getTeamsOfUser = (userId: number): Teams[] | null => {
    const teams = getTeams();
    if (!teams) return null;
    const userTeams = teams.filter(team => team.members.includes(userId) || team.teamLead === userId);
    return userTeams.length > 0 ? userTeams : null;
};

export const updateTeam = (teamId: number, teamName: string, members: number[]): Teams | null => {
    const storedTeams = localStorage.getItem("teams");
    const teams: Teams[] = storedTeams ? JSON.parse(storedTeams) : [];

    const teamIndex = teams.findIndex(team => team.id === teamId);
    if (teamIndex === -1) return null;

    
    const currentTeamMembers = teams[teamIndex].members;
    for (const memberId of members) {

        if (!currentTeamMembers.includes(memberId) && isMemberInAnyTeam(memberId, teamId)) {
            return null;
        }
    }

    teams[teamIndex] = {
        ...teams[teamIndex],
        teamName,
        members
    };

    localStorage.setItem("teams", JSON.stringify(teams));
    return teams[teamIndex];
};

export const deleteTeam = (teamId: number): boolean => {
    const storedTeams = localStorage.getItem("teams");
    const teams: Teams[] = storedTeams ? JSON.parse(storedTeams) : [];

    const filteredTeams = teams.filter(team => team.id !== teamId);

    if (filteredTeams.length === teams.length) return false;

    localStorage.setItem("teams", JSON.stringify(filteredTeams));
    return true;
};