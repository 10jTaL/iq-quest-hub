import { client } from "./client";

export type Newconfig = {
  id: number;
  webhook_url: string;
  api_key: string;
  max_api_retries: number;
};

export async function updateConfigFromDb(config: Newconfig) {
  const result = await client.query(
    `update site_config 
     set webhook_url = $1, 
     api_key = $2, 
     max_api_retries = $3
     where site_config.id = $4
     RETURNING id, webhook_url, api_key, max_api_retries`,
    [config.webhook_url, config.api_key, config.max_api_retries, config.id]
  );

  return result.rows[0];
}

export async function getConfigFromDb(): Promise<Newconfig[]> {
  const result = await client.query(
    "SELECT id, webhook_url, api_key, max_api_retries FROM site_config"
  );
  return result.rows;
}