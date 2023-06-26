package discord

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type WsLoginResponse struct {
	T  string `json:"t"`
	S  int    `json:"s"`
	Op int    `json:"op"`
	D  struct {
		V     int `json:"v"`
		Users []struct {
			Username         string `json:"username"`
			PublicFlags      int    `json:"public_flags"`
			ID               string `json:"id"`
			GlobalName       any    `json:"global_name"`
			DisplayName      any    `json:"display_name"`
			Discriminator    string `json:"discriminator"`
			Bot              bool   `json:"bot"`
			AvatarDecoration any    `json:"avatar_decoration"`
			Avatar           any    `json:"avatar"`
		} `json:"users"`
		UserSettingsProto string `json:"user_settings_proto"`
		UserSettings      struct {
			DmSpamFilterV2                    int    `json:"dm_spam_filter_v2"`
			DetectPlatformAccounts            bool   `json:"detect_platform_accounts"`
			AnimateStickers                   int    `json:"animate_stickers"`
			InlineAttachmentMedia             bool   `json:"inline_attachment_media"`
			Status                            string `json:"status"`
			DmSpamFilter                      int    `json:"dm_spam_filter"`
			MessageDisplayCompact             bool   `json:"message_display_compact"`
			ViewNsfwGuilds                    bool   `json:"view_nsfw_guilds"`
			TimezoneOffset                    int    `json:"timezone_offset"`
			EnableTtsCommand                  bool   `json:"enable_tts_command"`
			DisableGamesTab                   bool   `json:"disable_games_tab"`
			StreamNotificationsEnabled        bool   `json:"stream_notifications_enabled"`
			AnimateEmoji                      bool   `json:"animate_emoji"`
			GuildFolders                      []any  `json:"guild_folders"`
			ActivityJoiningRestrictedGuildIds []any  `json:"activity_joining_restricted_guild_ids"`
			FriendSourceFlags                 struct {
				All bool `json:"all"`
			} `json:"friend_source_flags"`
			BroadcastAllowedUserIds       []any  `json:"broadcast_allowed_user_ids"`
			ConvertEmoticons              bool   `json:"convert_emoticons"`
			AfkTimeout                    int    `json:"afk_timeout"`
			Passwordless                  bool   `json:"passwordless"`
			ContactSyncEnabled            bool   `json:"contact_sync_enabled"`
			BroadcastAllowFriends         bool   `json:"broadcast_allow_friends"`
			GifAutoPlay                   bool   `json:"gif_auto_play"`
			CustomStatus                  any    `json:"custom_status"`
			NativePhoneIntegrationEnabled bool   `json:"native_phone_integration_enabled"`
			AllowAccessibilityDetection   bool   `json:"allow_accessibility_detection"`
			BroadcastAllowedGuildIds      []any  `json:"broadcast_allowed_guild_ids"`
			FriendDiscoveryFlags          int    `json:"friend_discovery_flags"`
			ShowCurrentGame               bool   `json:"show_current_game"`
			RestrictedGuilds              []any  `json:"restricted_guilds"`
			DeveloperMode                 bool   `json:"developer_mode"`
			ViewNsfwCommands              bool   `json:"view_nsfw_commands"`
			RenderReactions               bool   `json:"render_reactions"`
			Locale                        string `json:"locale"`
			RenderEmbeds                  bool   `json:"render_embeds"`
			InlineEmbedMedia              bool   `json:"inline_embed_media"`
			DefaultGuildsRestricted       bool   `json:"default_guilds_restricted"`
			ExplicitContentFilter         int    `json:"explicit_content_filter"`
			ActivityRestrictedGuildIds    []any  `json:"activity_restricted_guild_ids"`
			Theme                         string `json:"theme"`
		} `json:"user_settings"`
		UserGuildSettings struct {
			Version int   `json:"version"`
			Partial bool  `json:"partial"`
			Entries []any `json:"entries"`
		} `json:"user_guild_settings"`
		User struct {
			Verified         bool   `json:"verified"`
			Username         string `json:"username"`
			PurchasedFlags   int    `json:"purchased_flags"`
			PremiumType      int    `json:"premium_type"`
			Premium          bool   `json:"premium"`
			Phone            any    `json:"phone"`
			NsfwAllowed      any    `json:"nsfw_allowed"`
			Mobile           bool   `json:"mobile"`
			MfaEnabled       bool   `json:"mfa_enabled"`
			ID               string `json:"id"`
			HasBouncedEmail  bool   `json:"has_bounced_email"`
			GlobalName       any    `json:"global_name"`
			Flags            int    `json:"flags"`
			Email            any    `json:"email"`
			DisplayName      any    `json:"display_name"`
			Discriminator    string `json:"discriminator"`
			Desktop          bool   `json:"desktop"`
			Bio              string `json:"bio"`
			BannerColor      any    `json:"banner_color"`
			Banner           any    `json:"banner"`
			AvatarDecoration any    `json:"avatar_decoration"`
			Avatar           any    `json:"avatar"`
			AccentColor      any    `json:"accent_color"`
		} `json:"user"`
		Tutorial struct {
			IndicatorsSuppressed bool  `json:"indicators_suppressed"`
			IndicatorsConfirmed  []any `json:"indicators_confirmed"`
		} `json:"tutorial"`
		Sessions []struct {
			Status     string `json:"status"`
			SessionID  string `json:"session_id"`
			ClientInfo struct {
				Version int    `json:"version"`
				Os      string `json:"os"`
				Client  string `json:"client"`
			} `json:"client_info"`
			Activities []any `json:"activities"`
		} `json:"sessions"`
		SessionType      string `json:"session_type"`
		SessionID        string `json:"session_id"`
		ResumeGatewayURL string `json:"resume_gateway_url"`
		Relationships    []any  `json:"relationships"`
		ReadState        struct {
			Version int  `json:"version"`
			Partial bool `json:"partial"`
			Entries []struct {
				MentionCount     int       `json:"mention_count"`
				LastPinTimestamp time.Time `json:"last_pin_timestamp"`
				LastMessageID    string    `json:"last_message_id"`
				ID               string    `json:"id"`
				Flags            int       `json:"flags"`
			} `json:"entries"`
		} `json:"read_state"`
		PrivateChannels []any `json:"private_channels"`
		MergedMembers   [][]struct {
			UserID                     string    `json:"user_id"`
			Roles                      []any     `json:"roles"`
			PremiumSince               any       `json:"premium_since"`
			Pending                    bool      `json:"pending"`
			Nick                       any       `json:"nick"`
			Mute                       bool      `json:"mute"`
			JoinedAt                   time.Time `json:"joined_at"`
			Flags                      int       `json:"flags"`
			Deaf                       bool      `json:"deaf"`
			CommunicationDisabledUntil any       `json:"communication_disabled_until"`
			Avatar                     any       `json:"avatar"`
		} `json:"merged_members"`
		Guilds []struct {
			OwnerID                   string    `json:"owner_id"`
			JoinedAt                  time.Time `json:"joined_at"`
			PremiumProgressBarEnabled bool      `json:"premium_progress_bar_enabled"`
			AfkTimeout                int       `json:"afk_timeout"`
			DiscoverySplash           any       `json:"discovery_splash"`
			Icon                      any       `json:"icon"`
			HomeHeader                any       `json:"home_header"`
			Channels                  []struct {
				Version              int64  `json:"version"`
				Type                 int    `json:"type"`
				Position             int    `json:"position"`
				PermissionOverwrites []any  `json:"permission_overwrites"`
				Name                 string `json:"name"`
				ID                   string `json:"id"`
				Flags                int    `json:"flags"`
				Topic                any    `json:"topic,omitempty"`
				RateLimitPerUser     int    `json:"rate_limit_per_user,omitempty"`
				ParentID             string `json:"parent_id,omitempty"`
				LastMessageID        string `json:"last_message_id,omitempty"`
				UserLimit            int    `json:"user_limit,omitempty"`
				RtcRegion            any    `json:"rtc_region,omitempty"`
				Bitrate              int    `json:"bitrate,omitempty"`
			} `json:"channels"`
			GuildScheduledEvents []any  `json:"guild_scheduled_events"`
			Description          any    `json:"description"`
			Lazy                 bool   `json:"lazy"`
			ID                   string `json:"id"`
			MfaLevel             int    `json:"mfa_level"`
			Emojis               []any  `json:"emojis"`
			Nsfw                 bool   `json:"nsfw"`
			Roles                []struct {
				Version      int64 `json:"version"`
				UnicodeEmoji any   `json:"unicode_emoji"`
				Tags         struct {
				} `json:"tags"`
				Position    int    `json:"position"`
				Permissions string `json:"permissions"`
				Name        string `json:"name"`
				Mentionable bool   `json:"mentionable"`
				Managed     bool   `json:"managed"`
				ID          string `json:"id"`
				Icon        any    `json:"icon"`
				Hoist       bool   `json:"hoist"`
				Flags       int    `json:"flags"`
				Color       int    `json:"color"`
			} `json:"roles"`
			AfkChannelID                any   `json:"afk_channel_id"`
			PremiumTier                 int   `json:"premium_tier"`
			Splash                      any   `json:"splash"`
			MaxStageVideoChannelUsers   int   `json:"max_stage_video_channel_users"`
			RulesChannelID              any   `json:"rules_channel_id"`
			Threads                     []any `json:"threads"`
			PublicUpdatesChannelID      any   `json:"public_updates_channel_id"`
			MaxMembers                  int   `json:"max_members"`
			NsfwLevel                   int   `json:"nsfw_level"`
			DefaultMessageNotifications int   `json:"default_message_notifications"`
			Stickers                    []any `json:"stickers"`
			HubType                     any   `json:"hub_type"`
			ApplicationCommandCounts    struct {
			} `json:"application_command_counts"`
			VerificationLevel     int    `json:"verification_level"`
			SystemChannelFlags    int    `json:"system_channel_flags"`
			MemberCount           int    `json:"member_count"`
			Region                string `json:"region"`
			ExplicitContentFilter int    `json:"explicit_content_filter"`
			ApplicationID         any    `json:"application_id"`
			StageInstances        []any  `json:"stage_instances"`
			MaxVideoChannelUsers  int    `json:"max_video_channel_users"`
			Banner                any    `json:"banner"`
			SafetyAlertsChannelID any    `json:"safety_alerts_channel_id"`
			GuildHashes           struct {
				Version int `json:"version"`
				Roles   struct {
					Omitted bool   `json:"omitted"`
					Hash    string `json:"hash"`
				} `json:"roles"`
				Metadata struct {
					Omitted bool   `json:"omitted"`
					Hash    string `json:"hash"`
				} `json:"metadata"`
				Channels struct {
					Omitted bool   `json:"omitted"`
					Hash    string `json:"hash"`
				} `json:"channels"`
			} `json:"guild_hashes"`
			Large                      bool   `json:"large"`
			VanityURLCode              any    `json:"vanity_url_code"`
			IncidentsData              any    `json:"incidents_data"`
			Name                       string `json:"name"`
			PreferredLocale            string `json:"preferred_locale"`
			SystemChannelID            string `json:"system_channel_id"`
			PremiumSubscriptionCount   int    `json:"premium_subscription_count"`
			Features                   []any  `json:"features"`
			LatestOnboardingQuestionID any    `json:"latest_onboarding_question_id"`
		} `json:"guilds"`
		GuildJoinRequests     []any    `json:"guild_join_requests"`
		GuildExperiments      [][]any  `json:"guild_experiments"`
		GeoOrderedRtcRegions  []string `json:"geo_ordered_rtc_regions"`
		FriendSuggestionCount int      `json:"friend_suggestion_count"`
		Experiments           [][]any  `json:"experiments"`
		CountryCode           string   `json:"country_code"`
		Consents              struct {
			Personalization struct {
				Consented bool `json:"consented"`
			} `json:"personalization"`
		} `json:"consents"`
		ConnectedAccounts []any    `json:"connected_accounts"`
		AuthSessionIDHash string   `json:"auth_session_id_hash"`
		APICodeVersion    int      `json:"api_code_version"`
		AnalyticsToken    string   `json:"analytics_token"`
		Trace             []string `json:"_trace"`
	} `json:"d"`
}

type wsD struct {
	Token        string      `json:"token"`
	Capabilities int         `json:"capabilities"`
	Properties   XProperties `json:"properties"`
}

type WsPresence struct {
	Status     string        `json:"status"`
	Since      int           `json:"since"`
	Activities []interface{} `json:"activities"`
	Afk        bool          `json:"afk"`
}

type wsGH struct {
}

type wsClientState struct {
	GuildHashes              wsGH   `json:"guild_hashes"`
	HighestLastMessageID     string `json:"highest_last_message_id"`
	ReadStateVersion         int    `json:"read_state_version"`
	UserGuildSettingsVersion int    `json:"user_guild_settings_version"`
	UserSettingsVersion      int    `json:"user_settings_version"`
}

type payloadWsLogin struct {
	Op          int           `json:"op"`
	D           wsD           `json:"d"`
	Presence    WsPresence    `json:"presence"`
	Compress    bool          `json:"compress"`
	ClientState wsClientState `json:"client_state"`
}

// Log token trougth websocket and return *WsLoginResponse. This function is required to join guild.
func (c *Client) WsConnect(loginTimeouts ...time.Duration) (*WsLoginResponse, error) {
	var loginTimeout time.Duration
	if len(loginTimeouts) > 0 {
		loginTimeout = loginTimeouts[0]
	} else {
		loginTimeout = 10 * time.Second
	}

	endTime := time.Now().Add(loginTimeout)

	for {
		if time.Now().After(endTime) || time.Now().Equal(endTime) {
			return nil, fmt.Errorf("websocket login timeout reached")
		}

		var dialer websocket.Dialer

		if c.HttpClient.Config.Proxy != "" {
			proxyUrl, err := url.Parse(c.HttpClient.Config.Proxy)
			if err != nil {
				return nil, err
			}

			dialer = websocket.Dialer{
				Proxy: http.ProxyURL(proxyUrl),
			}
		}

		ws, _, err := dialer.Dial("wss://gateway.discord.gg/?encoding=json&v=9", http.Header{
			"Origin":     []string{"https://discord.com"},
			"User-Agent": []string{c.HttpClient.Config.BrowserFp.Navigator.UserAgent},
		})

		if err != nil {
			return nil, err
		}

		defer ws.Close()
		ws.ReadMessage()

		Payload, _ := json.Marshal(&payloadWsLogin{
			Op: 2,
			D: wsD{
				Token:        c.Config.Token,
				Capabilities: 125,
				Properties: XProperties{
					Os:                     c.UaInfo.OSName,
					Browser:                c.UaInfo.BrowserName,
					Device:                 "",
					SystemLocale:           c.HttpClient.Config.BrowserFp.Navigator.Language,
					BrowserUserAgent:       c.HttpClient.Config.BrowserFp.Navigator.UserAgent,
					BrowserVersion:         c.UaInfo.BrowserVersion,
					OsVersion:              c.UaInfo.OSVersion,
					Referrer:               "",
					ReferringDomain:        "",
					ReferrerCurrent:        "",
					ReferringDomainCurrent: "",
					ReleaseChannel:         "stable",
					ClientBuildNumber:      c.BuildNumber,
					ClientEventSource:      nil,
				},
			},
			Presence: WsPresence{
				Status:     "online",
				Since:      0,
				Activities: nil,
				Afk:        false,
			},
			Compress: false,
			ClientState: wsClientState{
				GuildHashes:              wsGH{},
				HighestLastMessageID:     "0",
				ReadStateVersion:         0,
				UserGuildSettingsVersion: -1,
				UserSettingsVersion:      -1,
			},
		})

		if err = ws.WriteMessage(websocket.TextMessage, Payload); err != nil {
			continue
		}

		if _, buff, _ := ws.ReadMessage(); strings.Contains(string(buff), "READY") {
			var loginResponse WsLoginResponse
			if err := json.Unmarshal(buff, &loginResponse); err != nil {
				continue
			}

			c.SessionID = loginResponse.D.SessionID
			c.WsProperties = loginResponse

			return &loginResponse, nil
		}
	}
}
