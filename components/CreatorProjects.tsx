'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Users, DollarSign, Target, TrendingUp, Calendar, Clock, Award, Film } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  goal_amount: number
  current_amount: number
  backers_count: number
  deadline: string
  status: string
  video_id: string | null
  thumbnail_url: string | null
}

interface CreatorProjectsProps {
  creatorId: string
  currentVideoId?: string
  title?: string
}

export function CreatorProjects({ creatorId, currentVideoId, title = "Projects by this creator" }: CreatorProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/creator/projects/${creatorId}`)
        const data = await response.json()

        if (response.ok && data.projects) {
          // Filter out the current project/video if specified
          const filteredProjects = currentVideoId
            ? data.projects.filter((project: Project) => project.video_id !== currentVideoId)
            : data.projects

          setProjects(filteredProjects)
          setError(null)
        } else {
          throw new Error(data.error || 'Failed to fetch projects')
        }
      } catch (err) {
        setError('Failed to load projects')
        console.error('Error fetching creator projects:', err)
      } finally {
        setLoading(false)
      }
    }

    if (creatorId) {
      fetchProjects()
    }
  }, [creatorId, currentVideoId])

  if (loading || projects.length === 0) return null

  const progressPercentage = (projects[0].current_amount / projects[0].goal_amount) * 100

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" />
        {title}
      </h3>
      
      <div className="space-y-4">
        {projects.slice(0, 2).map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="block">
            <div className="flex gap-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
              {project.thumbnail_url && (
                <div className="w-16 h-24 rounded flex-shrink-0 overflow-hidden">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    width={64}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{project.title}</h4>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>${project.current_amount.toLocaleString()}</span>
                    <span>of</span>
                    <span>${project.goal_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{project.backers_count}</span>
                  </div>
                </div>
                
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-purple-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}