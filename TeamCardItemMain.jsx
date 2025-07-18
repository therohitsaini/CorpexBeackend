import React, { useEffect } from 'react'
import { Fragment } from 'react'
import TeamMemberSubmitForm from './TeamMemberSubmitForm'
import { useState } from 'react';
import TeamTable from './TeamTable';

function TeamCardItemMain({ showSnackbar, showError }) {
    const [teamMemberForm, setTeamMemberForm] = useState({
        image: null,
        name: '',
        role: '',
        item_Icone: ['', '', '', ''],
        urls: ['', '', '', ''],
        docsId: null, // Add docsId for update operations
        existingImage: null, // Add existingImage to track current image
    });

    const [id, setID] = useState()
    const [loader, setLoader] = useState(false)
    const [teamMode, setTeamMode] = useState("Table")
    const [teamCardDataApies, setTeamcardApies] = useState([])
    console.log(teamMemberForm)

    useEffect(() => {
        const userID = localStorage.getItem("user-ID")
        setID(userID)
    }, [])

    const submitTeamMember = async (e) => {
        try {
            const payload = new FormData();
            
            // Handle image upload logic
            if (teamMemberForm.image instanceof File) {
                // New image uploaded
                payload.append('image', teamMemberForm.image);
            } else if (teamMode === "UpdateTeamForm" && teamMemberForm.existingImage) {
                // Update mode with existing image - don't append image field
                // The backend will preserve the existing image
                console.log("Keeping existing image:", teamMemberForm.existingImage);
            }
            
            payload.append('name', teamMemberForm.name);
            payload.append('role', teamMemberForm.role);
            payload.append('item_Icone', JSON.stringify(teamMemberForm.item_Icone));
            payload.append('urls', JSON.stringify(teamMemberForm.urls));
            setLoader(true)

            let url, method;
            
            if (teamMode === "UpdateTeamForm") {
                // Update existing team member
                url = `${import.meta.env.VITE_BACK_END_URL}api-team/api-update-team/${teamMemberForm.docsId}`;
                method = 'PUT';
            } else {
                // Create new team member
                url = `${import.meta.env.VITE_BACK_END_URL}api-team/api-post-team/${id}`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                body: payload,
            });
            const result = await response.json()

            if (response.ok) {
                showSnackbar(result.message || "Team member updated successfully!")
                setLoader(false)
                
                // Reset form and go back to table
                setTeamMemberForm({
                    image: null,
                    name: '',
                    role: '',
                    item_Icone: ['', '', '', ''],
                    urls: ['', '', '', ''],
                    docsId: null,
                    existingImage: null,
                });
                setTeamMode("Table")
                
                // Refresh the team data
                getTeamCardData(id)
            } else {
                showError(result.message || 'Something went wrong')
                setLoader(false)
            }

        } catch (error) {
            showError('Error submitting team member')
            console.error('Error submitting team member:', error);
            setLoader(false)
        }
    };

    const getTeamCardData = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}api-team/api-get-team-card/${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            });

            const JsonData = await response.json();

            if (response.ok) {
                setTeamcardApies(JsonData.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTeamCardData(id)
    }, [id])

    console.log("teamCardDataApies", teamMemberForm)

    return (
        <Fragment>
            {
                teamMode === "SubmitTeamForm" || teamMode === "UpdateTeamForm" ?
                    (
                        <TeamMemberSubmitForm
                            setTeamMemberForm={setTeamMemberForm}
                            teamMemberForm={teamMemberForm}
                            submitTeamMember={submitTeamMember}
                            loader={loader}
                            setTeamMode={setTeamMode}
                            teamMode={teamMode}
                        />
                    )
                    :
                    (
                        <TeamTable
                            teamCardDataApies={teamCardDataApies}
                            showSnackbar={showSnackbar}
                            setTeamMode={setTeamMode}
                            setTeamMemberForm={setTeamMemberForm}
                        />
                    )
            }
        </Fragment>
    )
}

export default TeamCardItemMain 