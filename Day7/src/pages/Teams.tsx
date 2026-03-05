import { useEffect, useRef, useState } from "react";
import { createTeam, deleteTeam, getTeams, updateTeam, type Teams, isMemberInAnyTeam } from "../models/Teams";
import { getUsers, type User } from "../models/user";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { MultiSelect } from "primereact/multiselect";

export function TeamsPage() {
  const [teams, setTeams] = useState<Teams[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [editingTeam, setEditingTeam] = useState<Teams | null>(null);
  const toast = useRef<Toast | null>(null);

  const currentUserId = Number(sessionStorage.getItem("id"));
  const userRole = sessionStorage.getItem("role");

  useEffect(() => {
    if (userRole !== "admin") {
      toast.current?.show({
        severity: "error",
        summary: "Access Denied",
        detail: "Only admins can access this page",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }

    setTeams(getTeams());
    setUsers(getUsers());
  }, [userRole]);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Team name is required",
      });
      return;
    }

    for (const memberId of selectedMembers) {
      if (isMemberInAnyTeam(memberId)) {
        const memberName = users?.find(u => u.id === memberId)?.name;
        toast.current?.show({
          severity: "error",
          summary: "Member Already in Team",
          detail: `${memberName} is already part of another team`,
        });
        return;
      }
    }

    const newTeam = createTeam(teamName, currentUserId, selectedMembers);

    if (!newTeam) {
      toast.current?.show({
        severity: "error",
        summary: "Team Creation Failed",
        detail: "Team name already exists",
      });
      return;
    }

    toast.current?.show({
      severity: "success",
      summary: "Team Created",
      detail: `Team "${teamName}" created successfully`,
    });

    setTeamName("");
    setSelectedMembers([]);
    setCreateVisible(false);
    setTeams(getTeams());
  };

  const handleEditTeam = () => {
    if (!editingTeam || !teamName.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Team name is required",
      });
      return;
    }

    const currentMembers = editingTeam.members;
    for (const memberId of selectedMembers) {
      if (!currentMembers.includes(memberId) && isMemberInAnyTeam(memberId, editingTeam.id)) {
        const memberName = users?.find(u => u.id === memberId)?.name;
        toast.current?.show({
          severity: "error",
          summary: "Member Already in Team",
          detail: `${memberName} is already part of another team`,
        });
        return;
      }
    }

    const updated = updateTeam(editingTeam.id, teamName, selectedMembers);

    if (!updated) {
      toast.current?.show({
        severity: "error",
        summary: "Update Failed",
        detail: "Could not update team",
      });
      return;
    }

    toast.current?.show({
      severity: "success",
      summary: "Team Updated",
      detail: "Team updated successfully",
    });

    setTeamName("");
    setSelectedMembers([]);
    setEditingTeam(null);
    setEditVisible(false);
    setTeams(getTeams());
  };

  const handleDeleteTeam = (teamId: number) => {
    if (deleteTeam(teamId)) {
      toast.current?.show({
        severity: "success",
        summary: "Team Deleted",
        detail: "Team deleted successfully",
      });
      setTeams(getTeams());
    }
  };

  const openEditDialog = (team: Teams) => {
    setEditingTeam(team);
    setTeamName(team.teamName);
    setSelectedMembers(team.members);
    setEditVisible(true);
  };

  const openCreateDialog = () => {
    setTeamName("");
    setSelectedMembers([]);
    setEditingTeam(null);
    setCreateVisible(true);
  };

  const userOptions = users?.filter(user => user.role !== "admin").map((user) => ({
    label: user.name,
    value: user.id,
  })) || [];

  const getLeadName = (leadId: number) => {
    return users?.find((u) => u.id === leadId)?.name || "Unknown";
  };

  const getMemberNames = (memberIds: number[]) => {
    return memberIds
      .map((id) => users?.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="dark:bg-black min-h-screen py-8 dark:bg-none bg-linear-to-r from-blue-300 to-blue-700 w-full">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center dark:text-white text-gray-800">
          Team Management
        </h1>
        <div className="mb-6 flex justify-end ">
          <button
            onClick={openCreateDialog}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg dark:border dark:border-white font-semibold transition-all">
            Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
          {teams ? (
            teams.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:border dark:border-gray-200 dark:bg-gray-900 rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-bold mb-4 dark:text-white text-gray-800">
                  {team.teamName}
                </h3>

                <div className="mb-4">
                  <p className="text-sm font-semibold dark:text-gray-300 text-gray-600">
                    Team Lead
                  </p>
                  <p className="dark:text-white text-gray-800">
                    {getLeadName(team.teamLead)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold dark:text-gray-300 text-gray-600">
                    Members ({team.members.length})
                  </p>
                  <p className="dark:text-white text-gray-800 text-sm wrap-break-word">
                    {getMemberNames(team.members) || "No members"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditDialog(team)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center dark:text-white text-gray-800 col-span-full">
              No teams created yet
            </p>
          )}
        </div>
      </div>

      <Dialog
        visible={createVisible}
        header="Create Team"
        onHide={() => setCreateVisible(false)}
        className="min-w-[90vw] md:min-w-[60vw] dark:bg-black"
      >
        <form className="flex flex-col gap-4 p-4">
          <div>
            <FloatLabel>
              <InputText
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full"
              />
              <label htmlFor="teamName">Team Name</label>
            </FloatLabel>
          </div>

          <div>
            <label className="text-sm font-semibold dark:text-white mb-2 block">
              Add Members
            </label>
            <MultiSelect
              value={selectedMembers}
              onChange={(e) => setSelectedMembers(e.value)}
              options={userOptions}
              placeholder="Select members"
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setCreateVisible(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateTeam}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog
        visible={editVisible}
        header="Edit Team"
        onHide={() => setEditVisible(false)}
        className="min-w-[90vw] md:min-w-[60vw] dark:bg-black"
      >
        <form className="flex flex-col gap-4 p-4">
          <div>
            <FloatLabel>
              <InputText
                id="editTeamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full"
              />
              <label htmlFor="editTeamName">Team Name</label>
            </FloatLabel>
          </div>

          <div>
            <label className="text-sm font-semibold dark:text-white mb-2 block">
              Team Members
            </label>
            <MultiSelect
              value={selectedMembers}
              onChange={(e) => setSelectedMembers(e.value)}
              options={userOptions}
              placeholder="Select members"
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setEditVisible(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditTeam}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
