import { useEffect, useState } from "react";
import { assets } from "../assets";
import { getParticipantColor, getParticipantInitial } from "../constants/participantColors";
import { getSourceOption } from "../constants/sourceOptions";
import type { MeetingGroup } from "../types";

type MeetingsListProps = {
  groups: MeetingGroup[];
};

const SKELETON_GROUP_HEIGHT = 108;
const SKELETON_RESERVED_HEIGHT = 120;
const SKELETON_MIN_ROWS = 3;
const SKELETON_MAX_ROWS = 7;

function getSkeletonRowsCount(): number {
  if (typeof window === "undefined") {
    return SKELETON_MAX_ROWS;
  }

  const availableHeight = Math.max(window.innerHeight - SKELETON_RESERVED_HEIGHT, SKELETON_GROUP_HEIGHT);
  const rows = Math.ceil(availableHeight / SKELETON_GROUP_HEIGHT);

  return Math.min(SKELETON_MAX_ROWS, Math.max(SKELETON_MIN_ROWS, rows));
}

function ParticipantAvatar({ participant }: { participant: string }) {
  return (
    <span className="participant-avatar" style={{ backgroundColor: getParticipantColor(participant) }}>
      <span className="participant-avatar-label">{getParticipantInitial(participant)}</span>
    </span>
  );
}

export function MeetingsList({ groups }: MeetingsListProps) {
  return (
    <section className="results-state" data-node-id="27141:11784">
      {groups.map((group) => (
        <div className="results-group" key={group.date}>
          <div className="date-row">
            <span className="date-label">{group.date}</span>
            <span className="weekday-label">{group.weekday}</span>
          </div>
          <div className="group-separator" />
          {group.meetings.map((meeting) => {
            const source = getSourceOption(meeting.source);

            return (
              <article className={`meeting-row${meeting.muted ? " is-muted" : ""}`} key={meeting.id}>
                <div className="meeting-row-layout">
                  <div className="meeting-left-col">
                    <div className={`meeting-thumb ${meeting.previewState === "processing" ? "" : "source-preview"}`}>
                      {meeting.previewState === "processing" ? (
                        <>
                          <img
                            alt=""
                            className="meeting-thumb-image"
                            src={meeting.thumb === "audio1" ? assets.thumbAudio1 : assets.thumbAudio2}
                          />
                          {meeting.previewState === "processing" ? (
                            <>
                              <div className="thumb-processing-dark" />
                              <div className="thumb-processing-blur" />
                              <div className="thumb-processing-strip" />
                            </>
                          ) : (
                            <>
                              <img alt="" className="play-icon" src={assets.playIcon} />
                              <div className="thumb-overlay" />
                            </>
                          )}
                        </>
                      ) : (
                        <img alt="" className="source-preview-icon" src={source.icon} />
                      )}
                      {meeting.previewState === "processing" && meeting.thumbBadge ? (
                        <span className="thumb-processing-label">{meeting.thumbBadge}</span>
                      ) : null}
                      {meeting.thumbBadge && meeting.previewState !== "processing" ? (
                        <span
                          className={`thumb-badge ${meeting.thumbBadgePosition === "top-left" ? "top-left" : "center"}`}
                        >
                          {meeting.thumbBadge}
                        </span>
                      ) : null}
                    </div>
                    <div className="meeting-main-text">
                      <p className="meeting-title">
                        {meeting.titlePrefix ? <span>{meeting.titlePrefix}</span> : null}
                        {meeting.titleHighlight ? <span className="title-highlight">{meeting.titleHighlight}</span> : null}
                        {meeting.titleSuffix ? <span>{meeting.titleSuffix}</span> : null}
                        {!meeting.titlePrefix && !meeting.titleHighlight && !meeting.titleSuffix ? meeting.title : null}
                      </p>
                      <div className="meeting-meta">
                        <span>{meeting.time}</span>
                        <img alt="" className="meta-dot" src={assets.durationDot} />
                        <span>{meeting.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="meeting-middle-col">
                    {meeting.participantVariant === "authors" ? (
                      <div className="participant-row authors">
                        <div className="authors-avatars">
                          {(meeting.authors?.length ? meeting.authors : [meeting.participant])
                            .slice(0, 3)
                            .map((author) => (
                              <ParticipantAvatar key={author} participant={author} />
                            ))}
                        </div>
                        <span className="participant-link">{meeting.participantDisplay ?? meeting.participant}</span>
                      </div>
                    ) : (
                      <div className="participant-row">
                        <ParticipantAvatar participant={meeting.participant} />
                        <span>{meeting.participantDisplay ?? meeting.participant}</span>
                      </div>
                    )}
                  </div>
                  <div className="meeting-right-col">
                    <div className="status-row">
                      <img alt="" className="source-icon" src={source.icon} />
                      <span>{source.label}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export function MeetingsSkeleton() {
  const [rowsCount, setRowsCount] = useState(getSkeletonRowsCount);

  useEffect(() => {
    const handleResize = () => {
      setRowsCount(getSkeletonRowsCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="skeleton-state" data-node-id="27141:11560">
      <div className="skeleton-list">
        {Array.from({ length: rowsCount }, (_, rowIndex) => (
          <div className="results-group" key={rowIndex}>
            <div className="date-row">
              <div className="date-skeleton-line skeleton-shimmer" />
            </div>
            <div className="group-separator" />
            <article className="skeleton-row">
              <div className="meeting-row-layout">
                <div className="meeting-left-col">
                  <div className="skeleton-thumb skeleton-shimmer" />
                  <div className="skeleton-main-text">
                    <div className="skeleton-line skeleton-shimmer w-280" />
                    <div className="skeleton-line skeleton-shimmer w-88" />
                  </div>
                </div>
                <div className="meeting-middle-col">
                  <div className="skeleton-line skeleton-shimmer w-111" />
                </div>
                <div className="meeting-right-col">
                  <div className="skeleton-line skeleton-shimmer w-87" />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MeetingsError({ message }: { message: string }) {
  return (
    <section className="error-state" data-node-id="27161:6408">
      <div className="error-content">
        <img alt="" className="error-monkey" src={assets.monkeyGif} />
        <div className="error-text-block">
          <h2>Не удалось ничего найти</h2>
          <p>{message}</p>
        </div>
      </div>
    </section>
  );
}

export function MeetingsEmpty({ title, description }: { title: string; description: string }) {
  return (
    <section className="empty-state">
      <div className="empty-card">
        <img alt="" className="empty-icon" src={assets.emptySearchIcon} />
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
