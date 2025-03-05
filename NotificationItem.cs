// Filename: NotificationItem.cs
// Handles in-game notifications

using UnityEngine;
using TMPro;
using System.Collections;

public class NotificationItem : MonoBehaviour
{
    public TextMeshProUGUI messageText;
    public float displayTime = 3f;
    public float fadeTime = 0.5f;
    public Color errorColor = Color.red;
    public Color normalColor = Color.white;
    
    private CanvasGroup canvasGroup;
    
    void Awake()
    {
        canvasGroup = GetComponent<CanvasGroup>();
        if (canvasGroup == null)
        {
            canvasGroup = gameObject.AddComponent<CanvasGroup>();
        }
        
        canvasGroup.alpha = 0f;
    }
    
    void Start()
    {
        StartCoroutine(ShowNotification());
    }
    
    public void SetMessage(string message, bool isError = false)
    {
        if (messageText != null)
        {
            messageText.text = message;
            messageText.color = isError ? errorColor : normalColor;
        }
    }
    
    private IEnumerator ShowNotification()
    {
        // Fade in
        float elapsedTime = 0f;
        while (elapsedTime < fadeTime)
        {
            canvasGroup.alpha = Mathf.Lerp(0f, 1f, elapsedTime / fadeTime);
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        canvasGroup.alpha = 1f;
        
        // Display for set time
        yield return new WaitForSeconds(displayTime);
        
        // Fade out
        elapsedTime = 0f;
        while (elapsedTime < fadeTime)
        {
            canvasGroup.alpha = Mathf.Lerp(1f, 0f, elapsedTime / fadeTime);
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        canvasGroup.alpha = 0f;
        
        // Destroy notification
        Destroy(gameObject);
    }
}
